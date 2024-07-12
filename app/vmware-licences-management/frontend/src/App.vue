<template>
  <div id="app">
    <h1>VMware License Manager</h1>

    <div>
      <h2>All Equipments</h2>
      <ul>
        <li v-for="equipment in equipments" :key="equipment.id">
          {{ equipment.name }} ({{ equipment.type }}) - Version: {{ equipment.version }}
        </li>
      </ul>
    </div>

    <div>
      <h2>Unused Licenses</h2>
      <ul>
        <li v-for="license in unusedLicenses" :key="license.id">
          BroadcomID: {{ license.broadcomID }} - BroadcomPath: {{ license.broadcomPath }} - {{ license.type }} - Version: {{ license.version }} - Clef: {{ license.clef }}
        </li>
      </ul>
    </div>

    <div>
      <h2>Associations</h2>
      <table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>License Type</th>
            <th>License Version</th>
            <th>License Key</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="association in associations" :key="association.equipmentId + '-' + association.licenseId">
            <td>{{ getEquipmentName(association.equipmentId) }}</td>
            <td>{{ getLicenseType(association.licenseId) }}</td>
            <td>{{ getLicenseVersion(association.licenseId) }}</td>
            <td>{{ getLicenseKey(association.licenseId) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>Associate Equipment with License</h2>
      <form @submit.prevent="associate">
        <select v-model="selectedEquipment">
          <option v-for="equipment in equipments" :key="equipment.id" :value="equipment.id">
            {{ equipment.name }} ({{ equipment.type }}) - Version: {{ equipment.version }}
          </option>
        </select>
        <select v-model="selectedLicense">
          <option v-for="license in filteredLicenses" :key="license.id" :value="license.id">
            {{ license.type }} - Version: {{ license.version }} - Clef: {{ license.clef }}
          </option>
        </select>
        <button type="submit">Associate</button>
      </form>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  setup() {
    const equipments = ref([]);
    const licenses = ref([]);
    const associations = ref([]);
    const selectedEquipment = ref(null);
    const selectedLicense = ref(null);

    const fetchEquipments = async () => {
      const res = await fetch('http://localhost:3000/api/equipments');
      equipments.value = await res.json();
    };

    const fetchLicenses = async () => {
      const res = await fetch('http://localhost:3000/api/licenses');
      licenses.value = await res.json();
    };

    const fetchAssociations = async () => {
      const res = await fetch('http://localhost:3000/api/associations');
      associations.value = await res.json();
    };

    const associate = async () => {
      const selectedEquipmentObj = equipments.value.find(e => e.id === selectedEquipment.value);
      const selectedLicenseObj = licenses.value.find(l => l.id === selectedLicense.value);

      // Check if the association is valid based on equipment and license types
      if (selectedEquipmentObj.type === "VMware vCenter Server") {
        // Only one vCenter Server license can be associated
        const existingVCenterAssociations = associations.value.filter(a =>
          a.equipmentId === selectedEquipment.value && getLicenseType(a.licenseId) === "VMware vCenter Server"
        );
        if (existingVCenterAssociations.length > 0) {
          alert('An equipment of type "VMware vCenter Server" can only be associated with one vCenter Server license.');
          return;
        }
      }

      if (selectedEquipmentObj.type === "VMware vSphere") {
        // Check if there's already a vSphere license associated
        const existingVSphereAssociations = associations.value.filter(a =>
          a.equipmentId === selectedEquipment.value && getLicenseType(a.licenseId) === "VMware vSphere"
        );
        if (existingVSphereAssociations.length > 0) {
          alert('An equipment of type "VMware vSphere" can only be associated with one vSphere license.');
          return;
        }
      }

      // Perform association if valid
      const association = {
        equipmentId: selectedEquipment.value,
        licenseId: selectedLicense.value
      };

      const res = await fetch('http://localhost:3000/api/associations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(association)
      });

      if (res.ok) {
        associations.value.push(association);
        alert('Association created');
        selectedEquipment.value = null;
        selectedLicense.value = null;
      } else {
        const error = await res.json();
        alert(error.error);
      }
    };

    const getEquipmentName = (id) => {
      const equipment = equipments.value.find(e => e.id === id);
      return equipment ? `${equipment.name} (Version: ${equipment.version})` : '';
    };

    const getLicenseType = (id) => {
      const license = licenses.value.find(l => l.id === id);
      return license ? `${license.type} - Clef: ${license.clef}` : '';
    };

    const unusedLicenses = computed(() => {
      const usedLicenseIds = associations.value.map(a => a.licenseId);
      return licenses.value.filter(l => !usedLicenseIds.includes(l.id));
    });

    const filteredLicenses = computed(() => {
      const selectedEquipmentObj = equipments.value.find(e => e.id === selectedEquipment.value);
      if (!selectedEquipmentObj) {
        return [];
      }

              
      if (selectedEquipmentObj.type === "VMware vCenter Server") {
        return unusedLicenses.value.filter(l =>
          (l.type === "VMware vCenter Server" && l.version === selectedEquipmentObj.version && !associations.value.some(a =>
            a.equipmentId === selectedEquipmentObj.id && getLicenseType(a.licenseId) === "VMware vCenter Server"
          )) ||
          (l.type === "VMware vSphere" && !associations.value.some(a =>
            a.equipmentId === selectedEquipmentObj.id && getLicenseType(a.licenseId) === "VMware vSphere"
          ))
        );
      } else if (selectedEquipmentObj.type === "VMware vSphere") {
        return unusedLicenses.value.filter(l =>
          l.type === "VMware vSphere" && !associations.value.some(a =>
            a.equipmentId === selectedEquipmentObj.id && getLicenseType(a.licenseId) === "VMware vSphere"
          )
        );
      }
      return [];
    });

    onMounted(() => {
      fetchEquipments();
      fetchLicenses();
      fetchAssociations();
    });

    return {
      equipments,
      licenses,
      associations,
      selectedEquipment,
      selectedLicense,
      associate,
      getEquipmentName,
      getLicenseType,
      unusedLicenses,
      filteredLicenses
    };
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form {
  margin-top: 10px;
}
</style>
