const fetchClubListUtil = async (id) => {
  try {
    const res = await fetch(`/api/clubs/${id}`);
    const data = await res.json();
    let clubs = [];
    data.forEach((club) =>
      clubs.push({
        name: club.name,
        id: club.id,
        country: club.country,
      })
    );
    return clubs;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchClubListUtil;
