import {Modal, View, TouchableOpacity} from 'react-native';
import AppText from './AppText';

export default function AppModal({modalVisible, setModalVisible, children}: any) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View className="bg-black/50 h-full ">
        <View className="bg-white  w-full px-screenPadding py-5 rounded-t-lg bottom-0 absolute">
          <TouchableOpacity
            className="absolute right-2 top-2 px-3 "
            onPress={() => setModalVisible((prev: boolean) => !prev)}>
            <AppText className="font-medium text-xl ">x</AppText>
          </TouchableOpacity>
          {
            children
          }
        </View>
      </View>
    </Modal>
  );
}
