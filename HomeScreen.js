import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, Alert, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookCard from '../components/Book';

const HomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Sen');
  const [searchActive, setSearchActive] = useState(false);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum`at', 'Sabtu', 'Minggu'];

  const fetchData = async () => {
    try {
      const response = await fetch('https://671a5c8aacf9aa94f6aa583f.mockapi.io/books');
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.genre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleAddItem = async () => {
    const newItem = {
      title: "Kecanduan Susu Tetangga",
      genre: "Comedy, NewAdult",
      director: "Marion D'Rossi",
      status: "Bersambung",
      image: "https://jj.cabaca.id/api/v2/files/covers%2Fkecanduan-susu-tetangga.jpg?download=false&api_key=32ded42cfffb77dee86a29f43d36a3641849d4b5904aade9a79e9aa6cd5b5948",
      description: "Mengelola pabrik Susu Tetangga memang tidaklah mudah...",
      rating: 4.6,
      releaseYear: "mei-02-2003"
    };

    try {
      const response = await fetch('https://671a5c8aacf9aa94f6aa583f.mockapi.io/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const addedItem = await response.json();

      setData((prevData) => [addedItem, ...prevData]);
      setFilteredData((prevData) => [addedItem, ...prevData]);
      Alert.alert("Success", "Item berhasil ditambahkan");
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert("Error", "Gagal menambahkan item");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`https://671a5c8aacf9aa94f6aa583f.mockapi.io/books/${id}`, { method: 'DELETE' });
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert("Error", "Gagal menghapus item");
    }
  };

  const handleSaveEdit = async (updatedItem) => {
    try {
      const response = await fetch(`https://671a5c8aacf9aa94f6aa583f.mockapi.io/books/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prevData) => {
          const newData = prevData.map((item) => (item.id === updatedItem.id ? result : item));
          setFilteredData(newData);
          return newData;
        });
        Alert.alert("Success", "Item berhasil di edit");
      } else {
        Alert.alert("Error", "Failed to update item on server");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item on server");
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setFilteredData(data);
    setSearchActive(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const numColumns = width > height ? 4 : 2;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>cabaca</Text>
          {searchActive ? (
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search books"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
              <TouchableOpacity onPress={resetSearch}>
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setSearchActive(true)}>
                <Ionicons name="search" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddItem} testID='add-button'>
                <Ionicons name="add-circle-outline" size={28} color="#333" style={styles.addButton} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Image
          source={{ uri: 'https://down-id.img.susercontent.com/file/id-11134207-7qul1-lj1inkc79pt93c' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <Text style={styles.updateText}>Update Setiap Hari</Text>

        <View style={styles.updateContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedCategory(day)}
                style={[
                  styles.dayButton,
                  selectedCategory === day && styles.selectedDayButton
                ]}
              >
                <Text style={[
                  styles.dayText,
                  selectedCategory === day && styles.selectedDayText
                ]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              genre={item.director}
              imageUrl={item.image}
              item={item}
              navigation={navigation}
              onDelete={() => handleDeleteItem(item.id)}
              onSaveEdit={handleSaveEdit}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns} 
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
          key={numColumns}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f0f0' 
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#33a67b' 
  },
  headerActions: { 
    flexDirection: 'row',
    alignItems: 'center' 
  },
  addButton: { 
    marginLeft: 10 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    borderRadius: 20,
    flex: 1,
  },
  searchInput: {
     flex: 1,
     paddingVertical: 8, 
     paddingLeft: 8, 
     color: '#333' 
    },
  bannerImage: { 
    width: '100%', 
    height: 200, 
    marginVertical: 10 
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  updateText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    left: 20, 
    color: '#333' 
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#e0e0e0',
    marginRight: 20,
  },
  selectedDayButton: { 
    backgroundColor: '#33a67b' 
  },
  dayText: { 
    color: '#333', 
    fontWeight: 'bold' 
  },
  selectedDayText: { 
    color: '#fff' 
  },
  flatListContent: { 
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default HomeScreen;
