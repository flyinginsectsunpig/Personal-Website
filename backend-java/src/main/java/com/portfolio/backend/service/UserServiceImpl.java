package com.portfolio.backend.service;

import com.portfolio.backend.dto.UserRequest;
import com.portfolio.backend.dto.UserResponse;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepository repository;

  public UserServiceImpl(UserRepository repository) {
    this.repository = repository;
  }

  @Override
  public UserResponse create(UserRequest request) {
    User entity = User.builder()
        .name(request.name())
        .email(request.email())
        .role(request.role())
        .build();
    return mapToResponse(repository.save(entity));
  }

  @Override
  public List<UserResponse> findAll() {
    return repository.findAll().stream().map(this::mapToResponse).toList();
  }

  @Override
  public UserResponse findById(Long id) {
    User user = repository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    return mapToResponse(user);
  }

  @Override
  public UserResponse update(Long id, UserRequest request) {
    User user = repository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    user.setName(request.name());
    user.setEmail(request.email());
    user.setRole(request.role());
    return mapToResponse(repository.save(user));
  }

  @Override
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new EntityNotFoundException("User not found: " + id);
    }
    repository.deleteById(id);
  }

  private UserResponse mapToResponse(User entity) {
    return new UserResponse(entity.getId(), entity.getName(), entity.getEmail(), entity.getRole());
  }
}
