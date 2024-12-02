package tracker.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MongoDbProvider {
  @Value("${app.mongo-db}")
  private String mongoDb;

  public String getMongoDb() {
    return mongoDb;
  }
}
