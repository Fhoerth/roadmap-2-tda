package tracker.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tracker.models.User;

public interface UserRepository extends MongoRepository<User, ObjectId> {
  @Query(value = "{ 'lu': ?0 }", exists = true)
  boolean existsByLu(String lu);

  @Query(value = "{ 'nickname': ?0 }", exists = true)
  boolean existsByNickname(String nickname);
}
