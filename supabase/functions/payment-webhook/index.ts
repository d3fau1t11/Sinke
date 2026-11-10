import { rejectOnlinePayment } from '../_shared/online-payments.mjs';

export default rejectOnlinePayment;
if (import.meta.main) Deno.serve(rejectOnlinePayment);
