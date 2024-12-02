package tracker.repositories;

import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import tracker.models.Script;

public interface ScriptRepository extends MongoRepository<Script, ObjectId> {
  Optional<Script> findByScriptId(String scriptId);
}
