package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.Problem;

public interface ProblemRepository extends MongoRepository<Problem, ObjectId> {
}
