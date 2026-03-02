package com.portfolio.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String email;
  private String role;

  public static Builder builder() {
    return new Builder();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public static class Builder {
    private final User instance = new User();

    public Builder id(Long value) {
      instance.id = value;
      return this;
    }

    public Builder name(String value) {
      instance.name = value;
      return this;
    }

    public Builder email(String value) {
      instance.email = value;
      return this;
    }

    public Builder role(String value) {
      instance.role = value;
      return this;
    }

    public User build() {
      return instance;
    }
  }
}
