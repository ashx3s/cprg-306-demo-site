import characters from "@/app/data/characters.json";

export async function GET() {
  return Response.json(characters);
}

export async function POST(request) {
  const body = await request.json();
  const { name, species, description } = body;
  if (!name || !species) {
    return Response.json(
      { error: "Name and species are required fields" },
      { status: 400 }
    );
  }
  const newCharacter = {
    id:
      characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1,
    name,
    species,
    description: description || "",
  };
  characters.push(newCharacter);
  return Response.json(newCharacter, { status: 201 });
}

export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return Response.json(
      { error: "ID is required to delete a character" },
      { status: 400 }
    );
  }
  const index = characters.findIndex((char) => char.id === id);
  if (index === -1) {
    return Response.json(
      { error: `Character with id ${id} is not found` },
      { status: 404 }
    );
  }
  const deletedCharacter = characters.splice(index, 1)[0];
  return Response.json(
    {
      message: "Character successfully deleted",
      character: deletedCharacter,
    },
    { status: 200 }
  );
}

export async function PUT(request) {
  const body = await request.json();
  const { id, name, species, description } = body;
  if (!id) {
    return Response.json(
      { error: "ID is required to update a character" },
      { status: 400 }
    );
  }
  if (!name || !species) {
    return Response.json(
      { error: "Name and species are required fields" },
      { status: 400 }
    );
  }
  const index = characters.findIndex((character) => character.id === id);
  if (index === -1) {
    return Response.json(
      { error: `Character with id ${id} is not found` },
      { status: 404 }
    );
  }
  characters[index] = {
    id,
    name,
    species,
    description: description || "",
  };
  return Response.json(characters[index]);
}

export async function PATCH(request) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) {
    return Response.json(
      { error: "ID is required to update a character" },
      { status: 400 }
    );
  }
  const index = characters.findIndex((character) => character.id === id);
  if (index === -1) {
    return Response.json(
      { error: `Character with id ${id} is not found` },
      { status: 404 }
    );
  }
  characters[index] = {
    id,
    ...characters[index],
    ...updates,
  };
  return Response.json(characters[index]);
}
