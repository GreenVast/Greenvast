import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './src/context/LanguageContext';

/* ===================== AUTHENTICATION ===================== */
import Login from './src/authentication/Login';
import Signup from './src/authentication/Signup';

/* ===================== FARMER SCREENS ===================== */
import FarmerHome from './src/Farmer/FarmerHome';
import FarmerProfile from './src/Farmer/FarmerProfile';
import Market from './src/Farmer/Market';
import Prices from './src/Farmer/Prices';
import UploadProduct from './src/Farmer/UploadProduct';
import LoanTracker from './src/Farmer/LoanTracker';
import NetWorth from './src/Farmer/NetWorth';
import Weather from './src/Farmer/Weather';
import Outbreaks from './src/Farmer/Outbreaks';
import Communities from './src/Farmer/Communities';
import CommunityChat from './src/Farmer/CommunityChat';

/* ===================== INVESTOR SCREENS ===================== */
import InvestorHome from './src/investor/InvestorHome';
import InvestorProfile from './src/investor/InvestorProfile';

/* ===================== BUYER SCREENS ===================== */
import BuyerHome from './src/buyer/BuyerHome';
import BuyerProfile from './src/buyer/BuyerProfile';

const Stack = createNativeStackNavigator();

/* ===================== MAIN APP NAVIGATION ===================== */
export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* AUTHENTICATION */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />

        {/* FARMER SECTION */}
        <Stack.Screen name="FarmerHome" component={FarmerHome} />
        <Stack.Screen name="FarmerProfile" component={FarmerProfile} />
        <Stack.Screen name="Market" component={Market} />
        <Stack.Screen name="Prices" component={Prices} />
        <Stack.Screen name="UploadProduct" component={UploadProduct} />
        <Stack.Screen name="LoanTracker" component={LoanTracker} />
        <Stack.Screen name="NetWorth" component={NetWorth} />
        <Stack.Screen name="Weather" component={Weather} />
        <Stack.Screen name="Outbreaks" component={Outbreaks} />
        <Stack.Screen name="Communities" component={Communities} />
        <Stack.Screen name="CommunityChat" component={CommunityChat} />

        {/* INVESTOR SECTION */}
        <Stack.Screen name="InvestorHome" component={InvestorHome} />
        <Stack.Screen name="InvestorProfile" component={InvestorProfile} />

        {/* BUYER SECTION */}
        <Stack.Screen name="BuyerHome" component={BuyerHome} />
        <Stack.Screen name="BuyerProfile" component={BuyerProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
