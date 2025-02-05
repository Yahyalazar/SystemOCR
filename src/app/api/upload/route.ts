export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded!" }), {
        status: 400,
      });
    }

    // Mock response simulating file processing
    const response = {
      message: "File processed successfully!",
      fileName: file.name || "mock-file.txt",
      data: {
        organization: "Fédération Royale Marocaine de Football",
        title: "FUTSAL",
        players: [
          { id: 1, name: "Player One", license: "12345" },
          { id: 2, name: "Player Two", license: "67890" },
        ],
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong!" }),
      { status: 500 }
    );
  }
}
