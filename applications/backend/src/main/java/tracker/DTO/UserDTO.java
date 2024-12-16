package tracker.DTO;

import org.bson.types.ObjectId;

public record UserDTO(ObjectId id, String lu, String nickname, String leetCodeUserName) {
}
