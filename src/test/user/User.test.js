import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { roleUser, statusUser } from '~/data/Constants';
import UsersList from '~/pages/users/UserList';

const mockUsers = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', userRole: 'admin', userStatus: 'active' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', userRole: 'user', userStatus: 'inactive' },
];

describe('UsersList Component', () => {
  test('renders the user list', () => {
    render(
      <MemoryRouter>
        <UsersList usersList={mockUsers} />
      </MemoryRouter>
    );

    mockUsers.forEach(user => {
      expect(screen.getByText(user.fullName)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
      expect(screen.getByText(user.phone)).toBeInTheDocument();
      expect(screen.getByText(roleUser[user.userRole])).toBeInTheDocument();
      expect(screen.getByText(statusUser[user.userStatus])).toBeInTheDocument();
    });
  });
});
