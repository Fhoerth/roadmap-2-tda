package tracker.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import tracker.serialization.ObjectIdDeserializer;
import tracker.serialization.ObjectIdSerializer;

@Document(collection = "users")
public class User {
  @Id
  @JsonSerialize(using = ObjectIdSerializer.class)
  @JsonDeserialize(using = ObjectIdDeserializer.class)
  private ObjectId id;

  private String lu;
  private String nickname;
  private Integer pin;

  // spotless:off
  public User() {}
  // spotless:on

  public User(String lu, String nickname, Integer pin) {
    this.nickname = nickname;
    this.lu = lu;
    this.pin = pin;
  }

  public ObjectId getId() {
    return id;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public String getLu() {
    return lu;
  }

  public void setLu(String lu) {
    this.lu = lu;
  }

  public String getNickname() {
    return nickname;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public Integer getpin() {
    return pin;
  }

  public void setPin(Integer pin) {
    this.pin = pin;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;

    if (obj == null || getClass() != obj.getClass())
      return false;

    User other = (User) obj;

    return id.equals(other.id) && lu.equals(other.lu) && nickname.equals(other.nickname) && pin.equals(other.pin);
  }

  @Override
  public int hashCode() {
    int primeNumber = 31;
    int result = id != null ? id.hashCode() : 0;

    result = primeNumber * result + (lu != null ? lu.hashCode() : 0);
    result = primeNumber * result + (nickname != null ? nickname.hashCode() : 0);
    result = primeNumber * result + pin;

    return result;
  }
}