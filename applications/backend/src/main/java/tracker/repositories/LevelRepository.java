package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.Level;

public interface LevelRepository extends MongoRepository<Level, ObjectId> {
}
