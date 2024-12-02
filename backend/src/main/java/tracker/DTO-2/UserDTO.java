package tracker.dto;

import org.bson.types.ObjectId;

public record UserDTO(ObjectId id, String nickname) {
}
