package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.User;

public interface UserRepository extends MongoRepository<User, ObjectId> {
}
