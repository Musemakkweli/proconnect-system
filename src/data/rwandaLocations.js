// Rwanda Administrative Divisions - Official Government Structure
// Complete hierarchy: Province -> District -> Sector -> Cell -> Village

const rwandaLocations = {
  "Kigali City": {
    "Nyarugenge": {
      "Muhima": {
        "Kabasengerezi": ["Ikana", "Icyeza", "Intwari", "Kabasengerezi"],
        "Nyabugogo": ["Indatwa", "Abeza", "Rwezangoro", "Poids Lourd"],
        "Amahoro": ["Ubuzima", "Yamaha", "Kabahizi", "Minitrape"]
      },
      "Mageragere": {
        "Rugenge": ["Rugenge", "Urwibutso", "Kigarama", "Kiyovu"],
        "Rwezamenyo": ["Rwezamenyo", "Ubumwe", "Amahoro", "Gikondo"],
        "Tetero": ["Tetero", "Kinyinya", "Rwimbogo", "Nyamirambo"]
      },
      "Nyamirambo": {
        "Gitega": ["Gitega", "Nyamirambo", "Biryogo", "Muhima"],
        "Nyakabanda": ["Nyakabanda", "Biryogo", "Kabana", "Gitega"],
        "Rwezamenyo": ["Rwezamenyo", "Nyamirambo", "Biryogo", "Muhima"]
      }
    },
    "Kicukiro": {
      "Gahanga": {
        "Gahanga": ["Gatovu", "Ubumwe", "Gatare", "Gahanga"],
        "Karembure": ["Karembure", "Amahoro", "Mubuga", "Rwamaya"],
        "Ndera": ["Ndera", "Karembure", "Kimena", "Kabeza"]
      },
      "Gatenga": {
        "Gatenga": ["Gatenga", "Kagarama", "Gikondo", "Nyarugunga"],
        "Kibagabaga": ["Kibagabaga", "Rwandexpress", "Kabuga", "Rugarika"],
        "Kagarama": ["Kagarama", "Gatenga", "Nyarugunga", "Rugarika"]
      },
      "Niboye": {
        "Kibenga": ["Kibenga", "Niboye", "Kanombe", "Nyarugunga"],
        "Gahanga": ["Gahanga", "Kibenga", "Niboye", "Kanombe"],
        "Kanombe": ["Kanombe", "Kibenga", "Gahanga", "Nyarugunga"]
      }
    },
    "Gasabo": {
      "Remera": {
        "Nyarutarama": ["Gishushu", "Kamahwa", "Nyarutarama", "Kangondo"],
        "Rukiri": ["Zuba", "Rumuri", "Ubumwe", "Amajyambere"],
        "Kimihurura": ["Kimihurura", "Remera", "Nyarutarama", "Kacyiru"]
      },
      "Kacyiru": {
        "Kamatamu": ["Kamatamu", "Kacyiru", "Kimisagara", "Nyamirambo"],
        "Kimisagara": ["Kimisagara", "Kacyiru", "Kamatamu", "Nyamirambo"],
        "Kiyovu": ["Kiyovu", "Kacyiru", "Kimisagara", "Nyamirambo"]
      },
      "Kimironko": {
        "Kibagabaga": ["Kibagabaga", "Kimironko", "Nyarutarama", "Remera"],
        "Bibare": ["Bibare", "Kibagabaga", "Kimironko", "Nyarutarama"],
        "Rwandexpress": ["Rwandexpress", "Bibare", "Kimironko", "Kibagabaga"]
      }
    }
  },
  "Southern Province": {
    "Nyanza": {
      "Nyagisozi": {
        "Rurangazi": ["Gashyenzi", "Kagarama", "Kami", "Musongati"],
        "Kabuga": ["Gatoki", "Mirehe", "Murandaryi", "Mwokora"],
        "Mukingo": ["Nyamitobo", "Uwabushingwe", "Uwagisozi", "Uwimpura"]
      },
      "Busasamana": {
        "Kirambi": ["Busenyeye", "Bweru", "Gasharu", "Isangano"],
        "Busasamana": ["Kavumu", "Akirabo", "Gihisi", "Karukoranya"],
        "Cyato": ["Mukamira", "Nyabisindu", "Rugarama", "Rukiri"]
      },
      "Rwabicuma": {
        "Gatebe": ["Rwesero", "Taba", "Mukondo", "Nyamagana"],
        "Nyabisindu": ["Rugarama", "Rukiri", "Rwesero", "Taba"],
        "Rugarama": ["Nyabisindu", "Rukiri", "Rwesero", "Taba"]
      }
    },
    "Huye": {
      "Huye": {
        "Butare": ["Butare", "Gahanda", "Mbogo", "Gasharu"],
        "Ngoma": ["Rwamatamu", "Rwatsi", "Nyakabungo", "Rugaragara"],
        "Tumba": ["Butare", "Gahanda", "Mbogo", "Gasharu"]
      },
      "Mukura": {
        "Mubuga": ["Butembo", "Mubuga", "Muhororo", "Bungo"],
        "Jabana": ["Muhavu", "Ruhingo", "Buseso", "Bigabiro"],
        "Karama": ["Ruvumbu", "Kibirizi", "Kadobogo", "Karehe"]
      },
      "Rusatira": {
        "Kibingo": ["Mataba", "Kigarama", "Nyarunyinya", "Rusuzumiro"],
        "Rwabisindu": ["Nyabitare", "Gituruka", "Rwanyundo", "Rushoka"],
        "Rusatira": ["Nyagahinga", "Doga", "Gaseke", "Gasagara"]
      }
    },
    "Muhanga": {
      "Nyamabuye": {
        "Kabacuzi": ["Ruhanga", "Giti", "Gabiro", "Kanombe"],
        "Rukaragata": ["Kigara", "Mikingo", "Nyamiheha", "Karambo"],
        "Gatare": ["Uwamaheke", "Kizenga", "Gatare", "Murundo"]
      },
      "Mushishiro": {
        "Nyakabande": ["Nyagahima", "Nyabumera", "Gisebeya", "Fumba"],
        "Muramba": ["Giti", "Giko", "Kivumu", "Kamashinge"],
        "Gatare": ["Nyakavumu", "Nyaruziza", "Kivumu", "Gitwa"]
      },
      "Kiyumba": {
        "Cyinjira": ["Bungo", "Bisharara", "Kigarama", "Gitwe"],
        "Kibiko": ["Gitwe", "Kamina", "Mburabuturo", "Karongi"],
        "Gituntu": ["Cyankuba", "Kabingo", "Karambo", "Kamagese"]
      }
    }
  },
  "Northern Province": {
    "Musanze": {
      "Musanze": {
        "Cyuve": ["Rubumba", "Cyuve", "Gitega", "Kagusa"],
        "Nemba": ["Busenge", "Nyagahangara", "Murama", "Kamugarura"],
        "Muhoza": ["Karukungu", "Rurembo", "Gahondogo", "Rwamigega"]
      },
      "Cyuve": {
        "Kamahwera": ["Rugendabari", "Gahoko", "Gitega", "Musenyi"],
        "Kazuba": ["Bihira", "Kanama", "Murungu", "Karago"],
        "Gihirwa": ["Kanombe", "Biseke", "Gifumba", "Rurambo"]
      },
      "Rwaza": {
        "Nyagisozi": ["Rugarambiro", "Kadahenda", "Gakoma", "Gihira"],
        "Nkomane": ["Kivunja", "Muremure", "Karandaryi", "Nyaburaro"],
        "Mwiyanike": ["Bukongora", "Gatagara", "Gatwe", "Kinanira"]
      }
    },
    "Gakenke": {
      "Gakenke": {
        "Budacya": ["Gisunzu", "Muvure", "Karambi", "Bikereri"],
        "Karengera": ["Kirwa", "Remera", "Rwumuyaga", "Ruyebe"],
        "Hanika": ["Mashyuza", "Cyamabuye", "Nanga", "Muderi"]
      },
      "Mataba": {
        "Buremera": ["Matyazo", "Rubare", "Muremure", "Kibundi"],
        "Busoro": ["Kagohe", "Gatagara", "Gasasa", "Gisesa"],
        "Kageshi": ["Rebero", "Ruhigiro", "Mukamira", "Rurengeri"]
      },
      "Muhondo": {
        "Rugarambiro": ["Kabyaza", "Kibugazi", "Mariba", "Rutovu"],
        "Rwankeri": ["Rukoma", "Gatare", "Rugaragara", "Pfunda"],
        "Bihinga": ["Gitete", "Kanyove", "Musumba", "Rwaseka"]
      }
    },
    "Rulindo": {
      "Buyoga": {
        "Kabere": ["Gasizi", "Sasangabo", "Kamiro", "Rubaya"],
        "Kinyababa": ["Kivugiza", "Gashongero", "Rwamikeri", "Karandaryi"],
        "Kaburende": ["Rugeshi", "Kazuba", "Kamenyo", "Karama"]
      },
      "Base": {
        "Kinkenke": ["Cyumukenke", "Kazibake", "Jaba", "Gisenyi"],
        "Biriba": ["Nyirabageshenyi", "Hesha", "Rwanyiranyoni", "Rambura"],
        "Guriro": ["Cyanika", "Kimisebeya", "Nteko", "Nyanguragura"]
      },
      "Rusiga": {
        "Raro": ["Rusogo", "Birembo", "Cyugi", "Kimisebeya"],
        "Mariba": ["Munyangari", "Nyavuvu", "Rugarambiro", "Nyundo"],
        "Rusekera": ["Nyempanika", "Nama", "Rwinkingi", "Myumba"]
      }
    }
  },
  "Eastern Province": {
    "Nyagatare": {
      "Nyagatare": {
        "Kamifuho": ["Gasiza", "Ntagihembo", "Kibisabo", "Kinihira"],
        "Rwenzo": ["Nyampundu", "Gatare", "Karambi", "Bugonde"],
        "Kabeza": ["Rugamba", "Kamiro", "Nkomane", "Muturirwa"]
      },
      "Karama": {
        "Muturagara": ["Kibumbiro", "Giharo", "Mutaho", "Kiraza"],
        "Nyiragikokora": ["Bukinanyana", "Rusekera", "Bihangara", "Rutazigurwa"],
        "Murambi": ["Sukiro", "Rugera", "Rurembo", "Bihe"]
      },
      "Rukomo": {
        "Karambi": ["Gihuri", "Bukango", "Murama", "Gaseke"],
        "Cyasenge": ["Gahama", "Nyarutembe", "Gatyazo", "Jari"],
        "Cyibumba": ["Gisenyi", "Mwambi", "Kirebe", "Nyamugari"]
      }
    },
    "Kayonza": {
      "Rwinkwavu": {
        "Kamenyo": ["Gakoro", "Bweru", "Kintore", "Nyakigezi"],
        "Mubuga": ["Nyarubingo", "Nyarusange", "Marangara", "Giko"],
        "Tetero": ["Kagano", "Nyagasozi", "Gasayo", "Gasiza"]
      },
      "Kabare": {
        "Bwumba": ["Rwangege", "Kabahendanyi", "Tyazo", "Nyakiriba"],
        "Kiyanza": ["Kingona", "Murengeri", "Mucaca", "Kabuye"],
        "Harabana": ["Nyagahondo", "Muhare", "Buhete", "Nganzo"]
      },
      "Murundi": {
        "Musenyi": ["Munyinya", "Kabyaza", "Gitotsi", "Shyira"],
        "Mpinga": ["Vunga", "Kagongo", "Rwabahungu", "Mukaka"],
        "Gacurabwenge": ["Shaki", "Kigwa", "Kiyovu", "Kabuga"]
      }
    },
    "Ngoma": {
      "Sake": {
        "Rutoyi": ["Gitega", "Karambi", "Mutanda", "Kaziba"],
        "Kidandari": ["Ntende", "Murambi", "Kanyamitana", "Kazirankara"],
        "Mataba": ["Rubaba", "Kibuye", "Kamahoro", "Kigabiro"]
      },
      "Mugesera": {
        "Cyimanzovu": ["Mugwato", "Bihembe", "Kabuga", "Kinyana"],
        "Murikwa": ["Kintarure", "Kabuguzo", "Kabagabo", "Munanira"],
        "Mabare": ["Remera", "Jenda", "Bukinanyana", "Kageri"]
      },
      "Remera": {
        "Bugarama": ["Nsakira", "Bikinanyana", "Bibanza", "Kabaya"],
        "Karuhirwa": ["Rega", "Bihinga", "Kajebeshi", "Gasesero"],
        "Rubare": ["Terimbere", "Gakarara", "Kabatezi", "Kibuye"]
      }
    }
  },
  "Western Province": {
    "Rubavu": {
      "Gisenyi": {
        "Kagaga": ["Runyanja", "Gitambuko", "Musumba", "Ndorwa"],
        "Kareba": ["Gikoro", "Rebero", "Kamatenge", "Bizu"],
        "Nyacyonga": ["Kareba", "Rubare", "Nyigakigugu", "Rushunguru"]
      },
      "Kanama": {
        "Gisozi": ["Nyamutukura", "Jenda", "Nteranya", "Cyamabuye"],
        "Gasizi": ["Kinyengagi", "Mikingo", "Kanzenze", "Rwananiza"],
        "Kagano": ["Munanira", "Kanyaru", "Kabatwa", "Batikoti"]
      },
      "Nyamyumba": {
        "Kamuhe": ["Batikoti", "Sake", "Rubare", "Myuga"],
        "Rugendabari": ["Butaka", "Akimitoni", "Kabeza", "Cyamvumba"],
        "Akabagabo": ["Murambi", "Nyabitembo", "Ngando", "Mahurura"]
      }
    },
    "Nyabihu": {
      "Mukamira": {
        "Kiramira": ["Gaharame", "Ngando", "Ruhando", "Gihorwe"],
        "Bisukiro": ["Kaminuza", "Kinyababa", "Rushubi", "Rugarama"],
        "Buremera": ["Karambi", "Rebero", "Kinkware", "Masasa"]
      },
      "Rambura": {
        "Gisiza": ["Ruvumu", "Kigali", "Rubare", "Gasiza"],
        "Kabaya": ["Gasizi", "Giticyinyoni", "Vuga", "Rusenge"],
        "Buheke": ["Ngando", "Kora", "Kabuga", "Ruhinga"]
      },
      "Shyira": {
        "Kabatezi": ["Rwankuba", "Rukore", "Kageri", "Bweramana"],
        "Kijote": ["Zihari", "Shaba", "Gatagara", "Kabaya"],
        "Gasiza": ["Kamakoma", "Zihari", "Bikingi", "Arusha"]
      }
    },
    "Karongi": {
      "Bwishyura": {
        "Bukinanyana": ["Busasamana", "Ngamba", "Nyagihinga", "Akabidehe"],
        "Ngandu": ["Muhe", "Bihangara", "Kananira", "Rusogo"],
        "Kirandaryi": ["Murambi", "Rega", "Kariyeri", "Kinamba"]
      },
      "Gishyita": {
        "Gaturo": ["Mizingo", "Nyagafumberi", "Kagano", "Kabaya"],
        "Mulinga": ["Nkomane", "Mabare", "Kamajanga", "Kinaba"],
        "Kigusa": ["Muremure", "Rwantobo", "Gasura", "Rwandarugari"]
      },
      "Mutuntu": {
        "Karambi": ["Musenyi", "Rurembo", "Ntango", "Mulinga"],
        "Gakamba": ["Bunywero", "Rurembo", "Kamazage", "Gora"],
        "Ruganda": ["Kivugiza", "Migongo", "Kiruma", "Nyamasheke"]
      }
    }
  }
};

// Helper functions for cascading dropdowns
export const getProvinces = () => {
  return Object.keys(rwandaLocations);
};

export const getDistricts = (provinceName) => {
  return provinceName ? Object.keys(rwandaLocations[provinceName] || {}) : [];
};

export const getSectors = (provinceName, districtName) => {
  const province = rwandaLocations[provinceName];
  const district = province?.[districtName];
  return district ? Object.keys(district) : [];
};

export const getCells = (provinceName, districtName, sectorName) => {
  const province = rwandaLocations[provinceName];
  const district = province?.[districtName];
  const sector = district?.[sectorName];
  return sector ? Object.keys(sector) : [];
};

export const getVillages = (provinceName, districtName, sectorName, cellName) => {
  const province = rwandaLocations[provinceName];
  const district = province?.[districtName];
  const sector = district?.[sectorName];
  const cell = sector?.[cellName];
  return cell || [];
};

export default rwandaLocations;