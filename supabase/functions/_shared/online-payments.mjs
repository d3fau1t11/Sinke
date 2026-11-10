// Online settlement stays disabled until provider verification and atomic writes are implemented.
export function rejectOnlinePayment(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  return Response.json(
    { error: "Online payments are unavailable. Choose cash on delivery." },
    { status: 503 },
  );
}
