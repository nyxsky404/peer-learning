# Fix Plan for Issue #442

## Issue: Search Path Poisoning in invite_to_study_room RPC

## Approach
Add the `SET search_path = public` modifier to the `invite_to_study_room` RPC function.

## Changes Made
1. Created migration `20260601000007_fix_invite_to_study_room_search_path.sql`.
2. Replaced `invite_to_study_room` to include `SET search_path = public`.

*This file was auto-generated for GSSoC 2026 compliance.*
