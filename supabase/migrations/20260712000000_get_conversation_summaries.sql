-- Create get_conversation_summaries function to fetch DM thread list summaries
create or replace function public.get_conversation_summaries(p_user_id uuid)
returns table (
  other_user_id uuid,
  message_id uuid,
  sender_id uuid,
  receiver_id uuid,
  content text,
  text text,
  message text,
  created_at timestamptz,
  read_at timestamptz,
  unread_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- First, confirm the current user is authorized to call this function (if authenticated)
  if auth.uid() is not null and auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized';
  end if;

  return query
  with last_messages as (
    select distinct on (
      case when m.sender_id = p_user_id then m.receiver_id else m.sender_id end
    )
      m.id as msg_id,
      case when m.sender_id = p_user_id then m.receiver_id else m.sender_id end as partner_id
    from public.messages m
    where (m.sender_id = p_user_id or m.receiver_id = p_user_id)
      and m.receiver_id is not null
    order by
      case when m.sender_id = p_user_id then m.receiver_id else m.sender_id end,
      m.created_at desc
  ),
  unread_counts as (
    select
      m.sender_id as partner_id,
      count(*)::bigint as count
    from public.messages m
    where m.receiver_id = p_user_id
      and m.read_at is null
    group by m.sender_id
  )
  select
    lm.partner_id as other_user_id,
    m.id as message_id,
    m.sender_id,
    m.receiver_id,
    m.content,
    m.text,
    m.content as message,
    m.created_at,
    m.read_at,
    coalesce(uc.count, 0)::bigint as unread_count
  from last_messages lm
  join public.messages m on m.id = lm.msg_id
  left join unread_counts uc on uc.partner_id = lm.partner_id
  order by m.created_at desc;
end;
$$;

grant execute on function public.get_conversation_summaries(uuid) to authenticated;
