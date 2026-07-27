import { Component, PropsWithChildren } from 'react';
import { AuthProvider } from './stores/useAuthStore';
import { VehicleProvider } from './stores/useVehicleStore';
import { RefuelProvider } from './stores/useRefuelStore';
import './app.scss';

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <AuthProvider>
        <VehicleProvider>
          <RefuelProvider>
            {this.props.children}
          </RefuelProvider>
        </VehicleProvider>
      </AuthProvider>
    );
  }
}

export default App;
