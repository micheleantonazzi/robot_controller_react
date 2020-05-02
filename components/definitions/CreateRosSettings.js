export const CreateRosSettings = oldRosSettings => {
  const ret = {
    is_connected: false,
    ros_connector: null,
    map_listener: null,
    pose_listener: null,
    camera_info_listener: null,
    cmd_vel_publisher: null,
  };
  if (oldRosSettings !== null) {
    ret.is_connected = oldRosSettings.is_connected;
    ret.ros_connector = oldRosSettings.ros_connector;
    ret.map_listener = oldRosSettings.map_listener;
    ret.pose_listener = oldRosSettings.pose_listener;
    ret.camera_info_listener = oldRosSettings.camera_info_listener;
    ret.cmd_vel_publisher = oldRosSettings.cmd_vel_publisher;
  }
  return ret;
};
