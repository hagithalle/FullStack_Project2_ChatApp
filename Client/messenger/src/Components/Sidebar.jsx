import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Grid, Box, Button, List, ListItem, ListItemText, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { createNewGroup, updateGroup, getGroupsByUserId, deleteGroup } from "../dl/slices/groupsSlice";
import { getAllUsers } from "../dl/slices/usersSlice";
import { Link, useNavigate } from "react-router-dom";
import Groups2Icon from '@mui/icons-material/Groups2';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Menu, MenuItem } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import MenuIcon from '@mui/icons-material/Menu';
import { blockedUser, getAllBlockedUser, unblockUser } from "../dl/slices/blockedUserSlice";

export default function Sidebar({ onlineUsers }) {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { groups } = useSelector((state) => state.groups);

    const [openAddGroupForm, setOpenAddGroupForm] = useState(false);
    const [openUpdateGroupForm, setOpenUpdateGroupForm] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [userAuth, setUserAuth] = useState({ _id: "", fullName: "" });
    const {blockedUsers} = useSelector(state => state.blockedUsers);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);  // New state to track selected group
    const [isChangeBlockUser, setChangeBlockUser] = useState(false)
   // const [filterBlockUser, setFilterBlockUser] = useState([])


    useEffect(() => {
        dispatch(getAllUsers());
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            setUserAuth({ _id: user._id, fullName: user.fullName });
            dispatch(getGroupsByUserId(user._id));
        }
    }, [dispatch]);

   useEffect(() => {
        dispatch(getAllBlockedUser())
    }, [dispatch, isChangeBlockUser]);
    

    useEffect(() => {
        if (userAuth._id) {
            setSelectedContributors(prev => 
                prev.includes(userAuth._id) ? prev : [...prev, userAuth._id]
            );
        }
    }, [userAuth]);

    useEffect(()=>{
        console.log("selectedContributors: ", selectedContributors)
    },[selectedContributors])

    // Reset selectedContributors when dialog is opened
  useEffect(() => {
    if (openAddGroupForm) {
      setSelectedContributors([]); // Reset when dialog opens
      setSelectedContributors(prev => 
        prev.includes(userAuth._id) ? prev : [...prev, userAuth._id]
    );
      setGroupName(""); // Optionally reset group name
    }
  }, [openAddGroupForm]);


    const filteredUsers = users?.filter(user => user._id !== userAuth?._id);

    const handleContributorChange = (userId) => {
        setSelectedContributors((prev) => 
            prev.includes(userId) 
            ? prev.filter(id => id !== userId) 
            : [...prev, userId]
        );
    };

    const handleAddGroup = async() => {
    

        await dispatch(createNewGroup({ name: groupName, users_id: selectedContributors }));
        setOpenAddGroupForm(false);
        dispatch(getGroupsByUserId(userAuth._id))
    };

    const handleUpdateGroup = () => {
        if (selectedGroup) {
            dispatch(updateGroup({ groupId: selectedGroup._id, name: groupName, users_id: selectedContributors }));
            setOpenUpdateGroupForm(false);
            dispatch(getGroupsByUserId(userAuth._id))
        }
    };
    const handleOpenUpdateGroupForm = () => {      
            setOpenUpdateGroupForm(true);
            setSelectedContributors(selectedGroup.users_id)
        
    };

    const handleDeleteGroup = async() => {
        if (selectedGroup) {
            await dispatch(deleteGroup(selectedGroup._id));
            setAnchorEl(null);  // Close the menu
            dispatch(getGroupsByUserId(userAuth._id))
        }
    };

    const isUserOnline = (userId) => (onlineUsers || []).some(user => user.userId === userId);

    const handleBlockUser = (userId) => {

       const isBlocked = Array.isArray(blockedUsers) && blockedUsers.some(blockedUser => blockedUser.blocked_user_id === userId  && blockedUser.user_id === userAuth._id);        
        
        // Block or unblock user
        if (isBlocked) {
            dispatch(unblockUser({ userId: userAuth._id, blockedUserId: userId }));
        } else {
            dispatch(blockedUser({ userId: userAuth._id, blockedUserId: userId }));
        }
    
        // This forces a re-render of the component when the block/unblock action completes.
        // Set state here to force a re-render
         setChangeBlockUser(prev => !prev);
    };

   useEffect(()=>{
        console.log("isChangeBlockUser:", isChangeBlockUser)
    },[isChangeBlockUser])

    const handleMenuClick = (event, group) => {
        setAnchorEl(event.currentTarget);
        setSelectedGroup(group);  // Set the group for editing
        setGroupName(group.name); // Set the group name
        setSelectedContributors(group.users.map(user => user._id));  // Set contributors
    };

    return (
        <Box display="flex" flexDirection="column" height="100%" p={2}>
            {/* Header */}
            <Typography variant="h6" gutterBottom sx={{ backgroundColor: 'rgba(20, 80, 150, 0.8)', color: "white", fontWeight: "bold", padding: "8px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ marginRight: "8px", color: "white" }} /> Users
                </Box>
                <Button sx={{ color: "white", backgroundColor: "transparent", "&:hover": { backgroundColor: "#7b1fa2" }, padding: "4px", minWidth: 0 }}>
                    <MenuIcon sx={{ fontSize: 22, color: "white" }} />
                </Button>
            </Typography>

            {/* Users List */}
            <List>
    {filteredUsers?.map((user) => (
        <ListItem key={user._id} disablePadding>
           
                <Grid container alignItems="center" justifyContent="space-between" width="100%">
                <Link to={`/messanger/chat/user/${user._id}`} style={{ textDecoration: 'none' }}>
                    <Grid item display="flex" alignItems="center">
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: isUserOnline(user._id) ? 'green' : 'red', marginRight: "15px" }} />
                        <Avatar sx={{ width: 30, height: 30, marginRight: "10px" }} src={user.avatar} />
                        <Typography>{user.fullName}</Typography>
                    </Grid>
                    </Link>
                    <Grid item>
                        <Button
                            onClick={() => handleBlockUser(user._id)} 
                         /*   sx={{
                                color: Array.isArray(blockedUsers) && blockedUsers.some(blockedUser => blockedUser.blocked_user_id._id === user._id ) 
                                    ? 'red'  // If the user is blocked, show red color
                                    : 'blue', // If the user is not blocked, show blue color
                                padding: 0
                            }}*/
                                sx={{
                                    color: Array.isArray(blockedUsers) && blockedUsers.some(blockedUser => blockedUser.blocked_user_id === user._id  && blockedUser.user_id === userAuth._id) 
                                        ? 'red'  // If the user is blocked, show red color
                                        : 'blue', // If the user is not blocked, show blue color
                                    padding: 0
                                }}
                        >
                            <BlockIcon sx={{ fontSize: 22 }} />
                        </Button>
                    </Grid>
                </Grid>
           
        </ListItem>
    ))}
</List>

            {/* Groups Section */}
            <Typography variant="h6" gutterBottom sx={{ backgroundColor: 'rgba(20, 80, 150, 0.8)', color: "white", fontWeight: "bold", padding: "8px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
                <Box display="flex" alignItems="center">
                    <Groups2Icon sx={{ marginRight: "8px", color: "white" }} /> Groups
                </Box>
                <Button onClick={() => setOpenAddGroupForm(true)} sx={{ color: "white", backgroundColor: "transparent", "&:hover": { backgroundColor: "#7b1fa2" }, padding: "4px", minWidth: 0 }}>
                    <GroupAddIcon sx={{ fontSize: 22, color: "white" }} />
                </Button>
            </Typography>

            {/* Groups List */}
            <List>
                {groups?.map((group) => (
                    <ListItem key={group._id} disablePadding sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link to={`/messanger/chat/group/${group._id}`} style={{ textDecoration: 'none' }}>
                            <ListItemText primary={group.name} />
                        </Link>
                        <MenuIcon sx={{ fontSize: 22 }} onClick={(e) => handleMenuClick(e, group)} />
                    </ListItem>
                ))}
            </List>

            {/* Menu for Group Options */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => handleOpenUpdateGroupForm()}>Edit Group</MenuItem>
                <MenuItem onClick={() => handleDeleteGroup()}>Delete Group</MenuItem>
            </Menu>

            {/* Dialog for Adding a New Group */}
            <Dialog open={openAddGroupForm} onClose={() => setOpenAddGroupForm(false)}>
                <DialogTitle>Create a New Group</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Group Name" 
                        variant="outlined" 
                        fullWidth value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} 
                        sx={{ mb: 2 }} 
                        />
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Select Contributors</Typography>
                    <FormGroup>
                        {filteredUsers?.map((user) => (
                            <FormControlLabel key={user._id} control={<Checkbox checked={selectedContributors.includes(user._id)} onChange={() => handleContributorChange(user._id)} />} label={user.fullName} />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddGroupForm(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleAddGroup} color="primary">Create Group</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Updating a Group */}
            <Dialog open={openUpdateGroupForm} onClose={() => setOpenUpdateGroupForm(false)}>
                    <DialogTitle>Update Group</DialogTitle>
                    <DialogContent>
                        <TextField 
                            label="Group Name" 
                            variant="outlined" 
                            fullWidth 
                            value={groupName} 
                            onChange={(e) => setGroupName(e.target.value)} 
                            sx={{ mb: 2 }} 
                        />
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Select Contributors</Typography>
                        <FormGroup>
                            {filteredUsers?.map((user) => (
                                <FormControlLabel 
                                    key={user._id} 
                                    control={
                                        <Checkbox 
                                            checked={selectedContributors.includes(user._id)} 
                                            onChange={() => handleContributorChange(user._id)} 
                                        />
                                    }
                                    label={user.fullName}
                                />
                            ))}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenUpdateGroupForm(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleUpdateGroup} color="primary">Update Group</Button>
                    </DialogActions>
                </Dialog>
        </Box>
    );
}