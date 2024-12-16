package tracker.DTO;

import org.bson.types.ObjectId;

public record LevelDTO(ObjectId id, String name, Integer Level) {
}
