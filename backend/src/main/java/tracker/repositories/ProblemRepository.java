package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.Category;

public interface ProblemRepository extends MongoRepository<Category, ObjectId> {
}
