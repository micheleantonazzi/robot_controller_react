export const CreateRosSettings = oldRosSettings => {
  const ret = {
    is_connected: false,
    ros_connector: null,
    map_listener: null,
    pose_listener: null,
  };
  if (oldRosSettings !== null) {
    ret.is_connected = oldRosSettings.is_connected;
    ret.ros_connector = oldRosSettings.ros_connector;
    ret.map_listener = oldRosSettings.map_listener;
    ret.pose_listener = oldRosSettings.pose_listener;
  }
  return ret;
};
