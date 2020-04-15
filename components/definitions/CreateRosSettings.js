export const CreateRosSettings = oldRosSettings => {
  const ret = {is_connected: false, ros_connector: null};
  if (oldRosSettings !== null) {
    ret.is_connected = oldRosSettings.is_connected;
    ret.ros_connector = oldRosSettings.ros_connector;
  }
  return ret;
};
