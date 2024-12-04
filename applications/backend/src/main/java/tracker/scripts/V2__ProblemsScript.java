package tracker.scripts;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.providers.MongoDbProvider;

@Component
public class V2__ProblemsScript implements MongoScript {
  private String name = "v2__problems-script-2.0";
  private String id = "v2__problems-script-2.0";

  private MongoClient mongoClient;
  private MongoDbProvider mongoDbProvider;

  @Autowired
  public V2__ProblemsScript(MongoClient mongoClient, MongoDbProvider mongoDbProvider) {
    this.mongoClient = mongoClient;
    this.mongoDbProvider = mongoDbProvider;
  }

  @Override
  public boolean run() {
    MongoDatabase database = mongoClient.getDatabase(mongoDbProvider.getMongoDb());
    MongoCollection<Document> collection = database.getCollection("problems");
    Document renameOperation = new Document("$rename", new Document("problems", "tasks"));
    collection.updateMany(new Document(), renameOperation);

    return true;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getName() {
    return name;
  }
}
