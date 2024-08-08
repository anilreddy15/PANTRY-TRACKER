'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { database } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { ref, get, set, remove } from "firebase/database";

const imageMap = {
  'whole chicken': '/whole chicken.jpeg',
  'carrots': '/carrots.jpeg',
  'ginger': '/ginger.jpeg',
  'milk': '/milk.jpeg',
  'garlic': '/garlic.jpeg',
  'potatoes': '/potatoes.jpeg',
  'oranges': '/oranges.jpeg',
  'red onions': '/red onions.jpeg',
  'white onions': '/white onions.jpeg',
  'whiskey': '/whiskey.jpeg',
  'eggs': '/eggs.jpeg',
  'apples': '/apples.jpeg',
  'tomatoes': '/tomatoes.jpeg',
  // Add more mappings as needed
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = await get(ref(database, 'inventory'));
    const data = snapshot.val();
    const inventoryList = [];

    for (let key in data) {
      inventoryList.push({
        name: key,
        ...data[key],
      });
    }
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item, quantity) => {
    if (!item || !quantity || quantity <= 0) return;
    const itemNameLower = item.toLowerCase();
    const itemRef = ref(database, `inventory/${itemNameLower}`);
    const itemSnap = await get(itemRef);

    if (itemSnap.exists()) {
      const { quantity: existingQuantity } = itemSnap.val();
      await set(itemRef, { quantity: existingQuantity + quantity });
    } else {
      await set(itemRef, { quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const itemNameLower = item.toLowerCase();
    const itemRef = ref(database, `inventory/${itemNameLower}`);
    const itemSnap = await get(itemRef);

    if (itemSnap.exists()) {
      const { quantity } = itemSnap.val();
      if (quantity === 1) {
        await remove(itemRef);
      } else {
        await set(itemRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setItemQuantity(1);
    setOpen(false);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="3px solid black" boxShadow={25} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: 'translate(-50%,-50%)' }}>
          <Typography variant="h5">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (itemName && itemQuantity > 0) {
                  addItem(itemName, itemQuantity);
                  handleClose();
                } else {
                  alert("Please enter a valid item name and quantity.");
                }
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box border="2px solid #333" borderRadius={3} width="95vw" height="65vh" overflow="auto">
        <Box width="100%" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center" borderRadius={3}>
          <Typography variant="h2" color="#333">Pantry Items</Typography>
        </Box>
        <Stack direction="row" padding={2} spacing={2} sx={{ overflowX: 'auto' }}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box key={name} minWidth="200px" minHeight="150px" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={3} border="2px solid violet" borderRadius={3}>
              {imageMap[name.toLowerCase()] && (
                <Image src={imageMap[name.toLowerCase()]} alt={name} width={100} height={100} />
              )}
              <Typography variant="h4" color="#333" padding={3}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h4" color="#333" padding={2}>{quantity}</Typography>
              <Stack direction="row" spacing={3}>
                <Button variant="contained" onClick={() => addItem(name, 1)}>+</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>-</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}



