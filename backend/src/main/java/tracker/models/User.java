package tracker.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
  @Id
  private String id;

  private String lu;
  private String nickname;
  private Integer pin;

  public User(String lu, String nickname, Integer pin) {
    this.nickname = nickname;
    this.lu = lu;
    this.pin = pin;
  }

  // Getters y Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
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
}
