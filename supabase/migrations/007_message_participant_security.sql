-- Sending a message requires participation in the order, not only a matching sender ID.
begin;
drop policy if exists "Users can insert own messages" on public.messages;
create policy "Participants can send order messages" on public.messages
  for insert to authenticated with check (
    sender_id = auth.uid() and exists (
      select 1 from public.orders o where o.id = order_id
        and (o.user_id = auth.uid() or o.rider_id = auth.uid())
    )
  );
commit;
