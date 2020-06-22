export const countParticipant = (users) => {
  let participant = { male: 0, female: 0 };
  if (!users.length > 0) {
    return participant;
  }
  users.forEach((user) => {
    switch (user.gender) {
      case "male":
        participant.male += 1;
        break;
      case "female":
        participant.female += 1;
    }
  });
  return participant;
};
