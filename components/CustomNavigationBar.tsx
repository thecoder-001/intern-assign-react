import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';

export default function CustomNavigationBar({ route, options }) {
    const title = getHeaderTitle(options, route.name);
  
    return (
      <Appbar.Header mode={"center-aligned"}>
        <Appbar.Content title={title}/>
      </Appbar.Header>
    );
  }