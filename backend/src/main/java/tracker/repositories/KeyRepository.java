package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.Key;

public interface KeyRepository extends MongoRepository<Key, ObjectId> {
}
