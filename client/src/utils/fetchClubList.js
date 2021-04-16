const fetchClubList = async (id) => {
  try {
    const res = await fetch(`/api/clubs/${id}`);
    const data = await res.json();
    let clubs = [];
    data.forEach((club) =>
      clubs.push({
        value: club.name
          .split(" ")
          .join("_")
          .toLowerCase(),
        label: club.name,
        id: club.id,
      })
    );
    return clubs;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export default fetchClubList;
