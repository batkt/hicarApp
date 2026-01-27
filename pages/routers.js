import zasvarchin from './zasvarchin';
import zakhialgiinDelgerengui from './zasvarchin/zakhialgiinDelgerengui';
import zakhiral from './zakhiral';
import Login from './burtgel/Login';
import tokhirgoo from './burtgel/tokhirgoo';
import nuutsUgSolikh from './burtgel/nuutsUgSolikh';
import undsenMedeelelZasakh from './burtgel/undsenMedeelelZasakh';
import duusaaguiAjil from './zakhiral/duusaaguiAjil';
import tsutslagdsan from './zakhiral/tsutslagdsan';
import asuulgaBuglukh from './zasvarchin/khab/asuulgaBuglukh';
import khab from './zasvarchin/khab/index';
import gariinUsegBatalgaajuulakh from './zasvarchin/khab/gariinUsegBatalgaajuulakh';
import khabiinKhyanalt from './zakhiral/khabiinKhyanalt';
import borluulaltiinTailan from './zakhiral/tailan/borluulaltiinTailan';
import aguulahiinHynalt from './zakhiral/aguulahiinHynalt';
import zahialgiinHynalt from './zakhiral/zahialgiinHynalt';
import tailan from './zakhiral/tailan/tailan';
import daalgavar from './daalgavar';
import daalgavarAjiltan from './daalgavar/daalgavarAjiltan';
import daalgavarBurtgekh from './daalgavar/daalgavarBurtgekh';
import daalgavarUzeh from './daalgavar/daalgavarUzeh';
import huwiinMedeelel from './zakhiral/huwiinMedeelel';
import jagsaalt from './zakhiral/Jagsaalt';
import Chart1 from './zakhiral/tailan/Chart';
import Irts from './irts';
import IrtsKhyanalt from './irts/IrtsKhyanalt';
import IrtsKhyanaltSaraar from './irts/IrtsKhyanaltSaraar';
import IrtsKhyanaltJileer from './irts/IrtsKhyanaltJileer';
import IrtsDelgerengui from './irts/IrtsDelgerengui';
import IrtsTuhuurumjBurtgel from './irts/IrtsTuhuurumjBurtgel';
import IrtsAmjilttai from './irts/IrtsAmjilttai';
import Onoshilgoo from './onoshilgoo';
import onoshilgooBurtgel from './onoshilgoo/onoshilgooBurtgel';
import Onosh from './onoshilgoo/onoshilgoo';
import onoshilgooHadgalah from './onoshilgoo/onoshilgooHadgalah';
import onoshilgooDelgerengui from './onoshilgoo/onoshilgooDelgerengui';

export function useKhuudasnuud(token, ajiltan) {
  if (!!token && ajiltan?.erkh === 'Zasvarchin')
    return [
      {
        name: 'Ирц',
        component: Irts,
        options: {headerShown: false},
      },
      {
        name: 'ХАБЭА-н бүртгэл',
        component: khab,
        options: {headerShown: false},
      },
      {
        name: 'Оношилгоо',
        component: Onoshilgoo,
        options: {headerShown: false},
      },
      {
        name: 'Даалгавар',
        component: daalgavarAjiltan,
      },
      {
        name: 'Захиалга',
        component: zasvarchin,
        options: {headerShown: false},
      },
      {
        name: 'Хувийн мэдээлэл',
        component: undsenMedeelelZasakh,
      },
      {
        name: 'zakhialgiinDelgerengui',
        component: zakhialgiinDelgerengui,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'Нууц үг солих',
        component: nuutsUgSolikh,
      },
      {
        name: 'asuulgaBuglukh',
        component: asuulgaBuglukh,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'daalgavarUzeh',
        component: daalgavarUzeh,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'gariinUsegBatalgaajuulakh',
        component: gariinUsegBatalgaajuulakh,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'Onosh',
        component: Onosh,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'onoshilgooBurtgel',
        component: onoshilgooBurtgel,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'onoshilgooHadgalah',
        component: onoshilgooHadgalah,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'onoshilgooDelgerengui',
        component: onoshilgooDelgerengui,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsDelgerengui',
        component: IrtsDelgerengui,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsAmjilttai',
        component: IrtsAmjilttai,
        options: {headerShown: false},
        hideDrawer: false,
      },
    ];
  if (!!token && ajiltan?.erkh === 'Zakhiral')
    return [
      {
        name: 'Нүүр',
        component: zakhiral,
        options: {headerShown: false},
      },
      {
        name: 'aguulahiinHynalt',
        component: aguulahiinHynalt,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'tokhirgoo',
        component: tokhirgoo,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'huwiinMedeelel',
        component: huwiinMedeelel,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'Хувийн мэдээлэл',
        component: undsenMedeelelZasakh,
      },
      {
        name: 'Нууц үг солих',
        component: nuutsUgSolikh,
      },

      {
        name: 'duusaaguiAjil',
        component: duusaaguiAjil,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'jagsaalt',
        component: jagsaalt,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'tsutslagdsan',
        component: tsutslagdsan,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'khabKhyanalt',
        component: khabiinKhyanalt,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'borluulaltiinTailan',
        component: borluulaltiinTailan,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'tailan',
        component: tailan,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'zahialgiinHynalt',
        component: zahialgiinHynalt,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'daalgavarUzeh',
        component: daalgavarUzeh,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'Chart',
        component: Chart1,
        options: {headerShown: false},
      },
      {
        name: 'IrtsTuhuurumjBurtgel',
        component: IrtsTuhuurumjBurtgel,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsAmjilttai',
        component: IrtsAmjilttai,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsKhyanalt',
        component: IrtsKhyanalt,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsKhyanaltSaraar',
        component: IrtsKhyanaltSaraar,
        options: {headerShown: false},
        hideDrawer: true,
      },
      {
        name: 'IrtsKhyanaltJileer',
        component: IrtsKhyanaltJileer,
        options: {headerShown: false},
        hideDrawer: true,
      },
      {
        name: 'daalgavar',
        component: daalgavar,
        options: {headerShown: false},
        hideDrawer: true,
      },
      {
        name: 'daalgavarBurtgekh',
        component: daalgavarBurtgekh,
        options: {headerShown: false},
        hideDrawer: true,
      },
    ];
  if (!!token )
    return [
      {
        name: 'Ирц',
        component: Irts,
        options: {headerShown: false},
      },
      {
        name: 'IrtsDelgerengui',
        component: IrtsDelgerengui,
        options: {headerShown: false},
        hideDrawer: false,
      },
      {
        name: 'IrtsAmjilttai',
        component: IrtsAmjilttai,
        options: {headerShown: false},
        hideDrawer: false,
      },
    ];
  return [
    {
      name: 'Login',
      component: Login,
      options: {headerShown: false},
    },
  ];
}
