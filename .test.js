import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { Dimensions } from 'react-native';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: '1',
          title: 'Kecanduan Susu Tetangga',
          genre: 'Comedy, NewAdult',
          director: "Marion D'Rossi",
          status: 'Bersambung',
          image:
            'https://jj.cabaca.id/api/v2/files/covers%2Fkecanduan-susu-tetangga.jpg?download=false&api_key=32ded42cfffb77dee86a29f43d36a3641849d4b5904aade9a79e9aa6cd5b5948',
          description: 'Deskripsi',
          rating: 4.6,
          releaseYear: 'mei-02-2003',
        },
        {
          id: '2',
          title: 'Tetangga Masa Depan',
          genre: 'Drama',
          director: 'John Doe',
          status: 'Selesai',
          image: 'https://example.com/cover2.jpg',
          description: 'Deskripsi lain',
          rating: 4.1,
          releaseYear: 'jun-15-2010',
        },
      ]),
  })
);

describe('<HomeScreen /> Tests', () => {
  it('should fetch and display data from API', async () => {
    const { findByText } = render(<HomeScreen />);

    const item1 = await findByText('Kecanduan Susu Tetangga');
    const item2 = await findByText('Tetangga Masa Depan');

    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();
  });

  it('should handle screen rotation correctly', async () => {
    const { findByText } = render(<HomeScreen />);

    const portraitDimensions = { width: 375, height: 667 };
    Dimensions.set({ window: portraitDimensions });

    const item1 = await findByText('Kecanduan Susu Tetangga');
    const item2 = await findByText('Tetangga Masa Depan');
    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();

    const landscapeDimensions = { width: 667, height: 375 };
    act(() => {
      Dimensions.set({ window: landscapeDimensions });
    });

    const item1AfterRotation = await findByText('Kecanduan Susu Tetangga');
    const item2AfterRotation = await findByText('Tetangga Masa Depan');
    expect(item1AfterRotation).toBeTruthy();
    expect(item2AfterRotation).toBeTruthy();
  });

  it('should render BookCard with correct props', async () => {
    const { findByText } = render(<HomeScreen />);

    const item1 = await findByText('Kecanduan Susu Tetangga');
    const item2 = await findByText('Tetangga Masa Depan');

    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();
    
    expect(item1).toHaveTextContent('Kecanduan Susu Tetangga');
    expect(item2).toHaveTextContent('Tetangga Masa Depan');
  });
});
