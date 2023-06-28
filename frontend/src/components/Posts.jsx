import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu, MenuItem } from '@mui/material';
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState("Latest");
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  }
  
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:5000/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedPosts=posts.slice().sort(function (p1, p2) {
    return Object.keys(p1.likes).length - Object.keys(p2.likes).length;
  });

  var viewPosts = posts;
  if (selectedOrder === "Latest") {
    viewPosts = posts;
  }
  else {
    viewPosts = sortedPosts;
  }


  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          color: "grey",
          fontWeight: "bold",
          fontSize: "0.9rem",
          textTransform: "none",
        }}
      >
        {selectedCategory ? selectedCategory : "All Categories"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleCategorySelect(null)}>
          All Categories
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Comedy")}>
          Entertainment
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Political")}>
          Political
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Bollywood")}>
          Bollywood
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Sports")}>
          Sports
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Academics")}>
          Academics
        </MenuItem>
      </Menu>

      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl2(event.currentTarget)}
        sx={{
          color: "grey",
          fontWeight: "bold",
          fontSize: "0.9rem",
          textTransform: "none",
        }}
      >
        {selectedOrder ? selectedOrder : "Latest"}
      </Button>

      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
      >
        <MenuItem onClick={() => handleOrderSelect("Latest")}>
          Latest
        </MenuItem>
        <MenuItem onClick={() => handleOrderSelect("Popular")}>
          Popular
        </MenuItem>
      </Menu>

      {Array.isArray(viewPosts) &&
        viewPosts.slice().reverse()
          .map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            )
          )}
    </>
  );
};

export default PostsWidget;