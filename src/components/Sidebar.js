import { Pressable, Text, View } from 'react-native';

const menuItems = [
  { value: 'dashboard', label: 'Dashboard', icon: '▣' },
  { value: 'transactions', label: 'Transaksi', icon: '≡' },
  { value: 'reports', label: 'Laporan', icon: '◔' },
];

export const Sidebar = ({
  activeScreen,
  onScreenChange,
  styles,
}) => (
  <View style={styles.sidebar}>
    <View>
      <Text style={styles.sidebarBrand}>◉ Keuangan</Text>
      <Text style={styles.sidebarCaption}>Laporan harian</Text>
    </View>

    <View style={styles.sidebarMenu}>
      {menuItems.map((item) => (
        <Pressable
          key={item.value}
          onPress={() => onScreenChange(item.value)}
          style={[
            styles.sidebarMenuItem,
            activeScreen === item.value && styles.sidebarMenuItemActive,
          ]}
        >
          <Text style={styles.sidebarMenuIcon}>{item.icon}</Text>
          <Text
            style={[
              styles.sidebarMenuText,
              activeScreen === item.value && styles.sidebarMenuTextActive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export const MobileNavigation = ({
  activeScreen,
  onScreenChange,
  styles,
}) => (
  <View style={styles.mobileNavigation}>
    {menuItems.map((item) => (
      <Pressable
        key={item.value}
        onPress={() => onScreenChange(item.value)}
        style={styles.mobileNavigationItem}
      >
        <Text
          style={[
            styles.mobileNavigationIcon,
            activeScreen === item.value && styles.mobileNavigationIconActive,
          ]}
        >
          {item.icon}
        </Text>
        <Text
          style={[
            styles.mobileNavigationText,
            activeScreen === item.value && styles.mobileNavigationTextActive,
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    ))}
  </View>
);
