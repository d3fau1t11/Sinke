export function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status);
}

export function unauthorizedResponse(): Response {
  return errorResponse('Unauthorized', 401);
}

export function forbiddenResponse(): Response {
  return errorResponse('Forbidden', 403);
}

export function notFoundResponse(message: string = 'Not found'): Response {
  return errorResponse(message, 404);
}

export function internalErrorResponse(): Response {
  return errorResponse('Internal server error', 500);
}