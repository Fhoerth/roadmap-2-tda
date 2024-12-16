package tracker.DTO;

import org.bson.types.ObjectId;

public record ProblemDTO(ObjectId id, ObjectId levelId, Integer leetCodeProblemId, String name, String difficulty,
    String url, String editCodeUrl, String slug) {
}
