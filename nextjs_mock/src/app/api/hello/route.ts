declare const NextResponse: any;
declare type NextRequest = {};
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}