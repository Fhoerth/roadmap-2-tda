package tracker.dto2;

import java.util.List;
import org.bson.types.ObjectId;

public record ProblemDTO(ObjectId id, Integer level, String name, List<TaskDTO> tasks) {
}
