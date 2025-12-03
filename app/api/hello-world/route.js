// naming convention matters
export function GET() {
  return Response.json({
    message: "Hello World",
    uses: "Serve data on the backend",
  });
}
