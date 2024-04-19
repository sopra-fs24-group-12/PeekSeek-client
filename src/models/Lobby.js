

class Lobby {
    constructor(data = {}) {
      this.id = null;
      this.name = null;
      this.maxParticipants = null;
      this.token = null;
      this.joinedParticipants = null;
      this.gameLocation = null;
      this.quests = null;
      this.roundDurationSeconds = null;
      Object.assign(this, data);
    }
  }
  
  export default Lobby;
  