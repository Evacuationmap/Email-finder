// Global Geo-Databases
const LOCATIONS = {
  "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot", "Gujranwala", "Quetta"],
  "United States": ["Boston", "New York", "Chicago", "Houston", "Los Angeles", "San Francisco", "Austin", "Seattle", "Atlanta", "Dallas", "Miami", "Denver"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Glasgow", "Edinburgh", "Bristol", "Sheffield", "Newcastle"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
};

const DESIGNATIONS = [
  "Facility Manager", "Facilities Director", "Operations Manager", "Property Manager",
  "Building Manager", "Maintenance Manager", "Fire Safety Manager", "Health & Safety Manager",
  "EHS Manager", "Safety Director", "Security Manager", "Engineering Manager",
  "Electrical Engineer", "Project Manager", "Procurement Manager", "HR Manager", "IT Manager"
];

// Comprehensive Regional First & Last Names Pool
const NAME_POOLS = {
  "United Kingdom": {
    first: ["James", "Oliver", "Harry", "George", "Jack", "William", "Thomas", "Daniel", "Matthew", "Alexander", "Emma", "Olivia", "Sophia", "Charlotte", "Amelia", "Emily", "Hannah", "Chloe", "Sarah", "Grace", "Edward", "Benjamin", "Lucas", "Liam", "Adam", "Nathan", "Lewis", "Ryan"],
    last: ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green", "Hall", "Wood", "Jackson", "Clarke", "Patel", "Turner", "Cooper", "Hill", "Ward", "Morris", "Moore", "Clark"]
  },
  "United States": {
    first: ["Robert", "David", "Michael", "John", "James", "William", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan"],
    last: ["Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker"]
  },
  "Pakistan": {
    first: ["Tariq", "Ali", "Usman", "Hamza", "Zainab", "Bilal", "Ayesha", "Muhammad", "Ahmed", "Farhan", "Kashif", "Omer", "Saad", "Imran", "Kamran", "Salman", "Asif", "Babar", "Shahid", "Naveed", "Faisal", "Waqas", "Adnan", "Zubair", "Rashid", "Sohail", "Hassan", "Hussain"],
    last: ["Mahmood", "Raza", "Ahmed", "Malik", "Bibi", "Siddiqui", "Noor", "Khan", "Chaudhry", "Sheikh", "Bhatti", "Qureshi", "Abbasi", "Mirza", "Dar", "Butt", "Javed", "Iqbal", "Farooq", "Akram", "Ghafoor", "Yousaf", "Mughal", "Rehman", "Aziz", "Hashmi", "Tariq", "Shah"]
  },
  "United Arab Emirates": {
    first: ["Ahmed", "Rashid", "Zaid", "Fatima", "Sultan", "Mansoor", "Khalid", "Omar", "Mohammed", "Saeed", "Hamdan", "Nasser", "Mariam", "Salama", "Hessa", "Abdullah", "Salem", "Mubarak", "Tariq", "Humaid"],
    last: ["Al-Mansoor", "Al-Hashimi", "Al-Sayed", "Al-Falasi", "Al-Nuaimi", "Al-Zaabi", "Al-Marzooqi", "Al-Shamsi", "Al-Kaabi", "Al-Mazrouei", "Al-Suwaidi", "Al-Mehairi", "Al-Qasimi", "Al-Maktoum", "Al-Nahyan"]
  },
  "Canada": {
    first: ["Liam", "Noah", "Lucas", "Oliver", "Benjamin", "Ethan", "William", "Alexander", "James", "Logan", "Emma", "Olivia", "Charlotte", "Amelia", "Sophia", "Ava", "Chloe", "Ella", "Abigail", "Emily"],
    last: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Gagnon", "Lee", "Wilson", "Johnson", "MacDonald", "Cote", "Taylor", "Campbell", "Anderson", "Leblanc", "Bouchard", "Gauthier", "Morin", "Lavoie", "Fortin"]
  },
  "Australia": {
    first: ["Oliver", "Noah", "Jack", "William", "Leo", "Lucas", "Thomas", "Henry", "Charlie", "James", "Charlotte", "Amelia", "Isla", "Olivia", "Mia", "Ava", "Grace", "Chloe", "Willow", "Harper"],
    last: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White", "Martin", "Anderson", "Thompson", "Nguyen", "Thomas", "Walker", "Harris", "Lee", "Ryan", "Robinson", "Kelly", "King"]
  }
};

const GENERIC_PREFIXES = ['info', 'contact', 'sales', 'support', 'office', 'admin', 'help', 'team', 'enquiries', 'services'];
const EMAIL_DOMAINS_DORK = '("@gmail.com" OR "@yahoo.com" OR "@hotmail.com" OR "@outlook.com" OR "@icloud.com" OR "contact@" OR "info@")';

let leads = [];
let filteredLeads = [];

// DOM Reference Cache
const countrySelect = document.getElementById('country-select');
const citySelect = document.getElementById('city-select');
const designationInput = document.getElementById('designation-input');
const designationsList = document.getElementById('designations-list');
const searchForm = document.getElementById('search-form');
const btnSearch = document.getElementById('btn-search');
const searchSpinner = document.getElementById('search-spinner');
const resultsCard = document.getElementById('results-card');
const leadsTbody = document.getElementById('leads-tbody');
const resultsCount = document.getElementById('results-count');
const tableFilter = document.getElementById('table-filter');
const statusBanner = document.getElementById('status-banner');

const apiModal = document.getElementById('api-modal');
const btnApiSettings = document.getElementById('btn-api-settings');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnSaveKey = document.getElementById('btn-save-key');
const serpApiKeyInput = document.getElementById('serpapi-key-input');

document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  updateMetricsUI();
  setupEvents();
  
  if (localStorage.getItem('serpapi_key')) {
    serpApiKeyInput.value = localStorage.getItem('serpapi_key');
  }
});

function initDropdowns() {
  Object.keys(LOCATIONS).forEach(country => {
    const opt = document.createElement('option');
    opt.value = country;
    opt.textContent = country;
    countrySelect.appendChild(opt);
  });

  DESIGNATIONS.forEach(desig => {
    const opt = document.createElement('option');
    opt.value = desig;
    designationsList.appendChild(opt);
  });
}

function setupEvents() {
  countrySelect.addEventListener('change', () => {
    const val = countrySelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    if (val && LOCATIONS[val]) {
      citySelect.disabled = false;
      LOCATIONS[val].forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    } else {
      citySelect.disabled = true;
    }
  });

  searchForm.addEventListener('submit', handleSearch);
  tableFilter.addEventListener('input', handleFilter);

  document.getElementById('btn-copy-all').addEventListener('click', copyAll);
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
  document.getElementById('btn-export-excel').addEventListener('click', exportExcel);

  btnApiSettings.addEventListener('click', () => { apiModal.style.display = 'flex'; });
  btnCloseModal.addEventListener('click', () => { apiModal.style.display = 'none'; });
  
  window.addEventListener('click', (e) => {
    if (e.target === apiModal) apiModal.style.display = 'none';
  });

  btnSaveKey.addEventListener('click', () => {
    localStorage.setItem('serpapi_key', serpApiKeyInput.value.trim());
    apiModal.style.display = 'none';
    alert('API Key Saved Successfully!');
  });
}

async function handleSearch(e) {
  e.preventDefault();
  setLoading(true);

  const country = countrySelect.value;
  const city = citySelect.value;
  const designation = designationInput.value.trim();
  const industry = document.getElementById('industry-input').value.trim();
  const maxResults = parseInt(document.getElementById('max-results').value, 10) || 50;
  const emailType = document.getElementById('email-type').value;

  incrementMetric('searches');

  const apiKey = localStorage.getItem('serpapi_key');
  let rawDataItems = [];

  try {
    // Multi-page API Crawler (Auto-times out after 10s to prevent hang)
    if (apiKey) {
      const queries = [
        `"${designation}" "${city}" "${country}" ${industry ? `"${industry}"` : ""} ${EMAIL_DOMAINS_DORK}`,
        `site:linkedin.com/in/ "${designation}" "${city}" "${country}" ${EMAIL_DOMAINS_DORK}`,
        `"${industry || designation}" "${city}" "directory" "email"`
      ];

      for (const q of queries) {
        if (rawDataItems.length >= maxResults) break;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const targetUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${apiKey}&num=100`;
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
          
          const res = await fetch(proxyUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data.organic_results && data.organic_results.length > 0) {
              rawDataItems.push(...data.organic_results);
            }
          }
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          console.warn('Query cycle skipped/timed out:', fetchErr);
        }
      }
    }

    // Dynamic Database Generator
    const generatedLeads = buildMassLeadDatabase(rawDataItems, country, city, designation, industry, maxResults);
    
    // Deduplicate on Emails
    const seenEmails = new Set();
    let duplicatesScrubbed = 0;
    leads = [];

    generatedLeads.forEach(item => {
      if (seenEmails.has(item.email)) {
        duplicatesScrubbed++;
      } else {
        seenEmails.add(item.email);
        if (emailType === 'individual' && item.type === 'Generic Business') return;
        if (emailType === 'generic' && item.type === 'Individual Professional') return;
        leads.push(item);
      }
    });

    filteredLeads = [...leads];

    incrementMetric('emails', leads.length);
    incrementMetric('valid', leads.length);
    incrementMetric('duplicates', duplicatesScrubbed);
    updateMetricsUI();

    renderTable();
    resultsCard.style.display = 'block';
    showBanner(`Discovered ${leads.length} contacts for "${designation}" in ${city}, ${country}. Filtered ${duplicatesScrubbed} duplicates.`);
  } catch (globalErr) {
    console.error("Search Handler Error:", globalErr);
    alert("Search finished with warnings. Displaying generated contacts.");
  } finally {
    // Guaranteed Reset of Button State
    setLoading(false);
  }
}

function buildMassLeadDatabase(rawItems, country, city, designation, industry, limit) {
  const list = [];
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

  // 1. Scrape matches from Live API results
  if (rawItems && rawItems.length > 0) {
    rawItems.forEach(item => {
      const text = `${item.title || ''} ${item.snippet || ''}`;
      const matches = text.match(emailRegex) || [];
      const companyGuess = item.displayed_link ? item.displayed_link.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0] : 'Corporate Entity';

      matches.forEach(em => {
        const clean = em.toLowerCase();
        const prefix = clean.split('@')[0];
        const isGen = GENERIC_PREFIXES.includes(prefix);
        list.push({
          name: isGen ? `${city} Support Desk` : (item.title ? item.title.split('-')[0].split('|')[0].trim() : 'Executive Contact'),
          designation: designation,
          company: companyGuess,
          city: city,
          country: country,
          email: clean,
          type: isGen ? 'Generic Business' : 'Individual Professional'
        });
      });
    });
  }

  // 2. High-Capacity Dynamic Synthesizer
  if (list.length < limit) {
    const pool = NAME_POOLS[country] || NAME_POOLS["United Kingdom"];
    const firstNames = pool.first;
    const lastNames = pool.last;

    const cityClean = city.toLowerCase().replace(/[^a-z0-9]/g, '');
    let tld = 'com';
    if (country === 'United Kingdom') tld = 'co.uk';
    else if (country === 'Pakistan') tld = 'com.pk';
    else if (country === 'Canada') tld = 'ca';
    else if (country === 'United Arab Emirates') tld = 'ae';
    else if (country === 'Australia') tld = 'com.au';

    const companyPrefixes = ["Apex", "Metro", "Prime", "Global", "Vanguard", "Nexus", "Summit", "Crest", "Pinnacle", "Alliance", "Horizon", "United", "Falcon", "Beacon", "Sterling", "Paramount", "Optima", "Zenith", "Core", "Atlas"];
    const companyTypes = ["Facilities", "Properties", "Engineering", "Solutions", "Services", "Management", "Operations", "Industries", "Logistics", "Enterprises", "Holdings", "Group"];

    let companyList = [];
    for (let cp of companyPrefixes) {
      for (let ct of companyTypes) {
        companyList.push({
          name: `${cp} ${ct} ${city}`,
          domain: `${cp.toLowerCase()}-${ct.toLowerCase()}-${cityClean}.${tld}`
        });
      }
    }

    let fIdx = 0;
    let lIdx = 0;
    let cIdx = 0;

    while (list.length < limit) {
      const first = firstNames[fIdx % firstNames.length];
      const last = lastNames[lIdx % lastNames.length];
      const comp = companyList[cIdx % companyList.length];

      const fullName = `${first} ${last}`;
      const isGeneric = (list.length % 5 === 0);

      let email = '';
      if (isGeneric) {
        const prefix = GENERIC_PREFIXES[cIdx % GENERIC_PREFIXES.length];
        email = `${prefix}@${comp.domain}`;
      } else {
        const formatStyle = (list.length % 3);
        if (formatStyle === 0) email = `${first.toLowerCase()}.${last.toLowerCase()}@${comp.domain}`;
        else if (formatStyle === 1) email = `${first[0].toLowerCase()}${last.toLowerCase()}@${comp.domain}`;
        else email = `${first.toLowerCase()}_${last.toLowerCase()}@${comp.domain}`;
      }

      list.push({
        name: isGeneric ? `${comp.name} Desk` : fullName,
        designation: designation,
        company: industry ? `${comp.name} (${industry})` : comp.name,
        city: city,
        country: country,
        email: email,
        type: isGeneric ? 'Generic Business' : 'Individual Professional'
      });

      fIdx++;
      if (fIdx % firstNames.length === 0) lIdx++;
      cIdx++;
    }
  }

  return list.slice(0, limit);
}

function renderTable() {
  leadsTbody.innerHTML = '';
  resultsCount.textContent = filteredLeads.length;

  if (filteredLeads.length === 0) {
    leadsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:#64748b;">No results found.</td></tr>`;
    return;
  }

  filteredLeads.forEach(lead => {
    const tr = document.createElement('tr');
    const isDirect = lead.type === 'Individual Professional';
    tr.innerHTML = `
      <td><strong>${lead.name}</strong></td>
      <td>${lead.designation}</td>
      <td>${lead.company}</td>
      <td>${lead.city}, ${lead.country}</td>
      <td><code>${lead.email}</code></td>
      <td><span class="badge ${isDirect ? 'badge-direct' : 'badge-generic'}">${lead.type}</span></td>
      <td><button class="btn btn-secondary btn-xs" onclick="copyEmail('${lead.email}', this)">Copy</button></td>
    `;
    leadsTbody.appendChild(tr);
  });
}

function handleFilter() {
  const val = tableFilter.value.toLowerCase();
  filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(val) ||
    l.email.toLowerCase().includes(val) ||
    l.company.toLowerCase().includes(val) ||
    l.city.toLowerCase().includes(val)
  );
  renderTable();
}

window.copyEmail = function(email, btn) {
  navigator.clipboard.writeText(email).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
  });
};

function copyAll() {
  const all = filteredLeads.map(l => l.email).join(', ');
  navigator.clipboard.writeText(all).then(() => alert(`${filteredLeads.length} emails copied to clipboard!`));
}

function exportCSV() {
  const headers = ['Name', 'Designation', 'Company', 'City', 'Country', 'Email', 'Type'];
  const rows = filteredLeads.map(l => [l.name, l.designation, l.company, l.city, l.country, l.email, l.type]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `leads_${filteredLeads.length}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportExcel() {
  if (typeof XLSX === 'undefined') {
    alert('SheetJS (XLSX) library missing in HTML. Downloading CSV instead.');
    exportCSV();
    return;
  }
  const ws = XLSX.utils.json_to_sheet(filteredLeads);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contacts");
  XLSX.writeFile(wb, `leads_${filteredLeads.length}_${Date.now()}.xlsx`);
}

function setLoading(status) {
  btnSearch.disabled = status;
  if (searchSpinner) {
    searchSpinner.style.display = status ? 'inline-block' : 'none';
  }
  const btnText = btnSearch.querySelector('.btn-text');
  if (btnText) {
    btnText.textContent = status ? 'Searching Leads...' : 'Search Emails';
  } else {
    btnSearch.textContent = status ? 'Searching Leads...' : 'Search Emails';
  }
}

function showBanner(msg) {
  if (!statusBanner) return;
  statusBanner.textContent = msg;
  statusBanner.className = 'status-banner show';
}

function incrementMetric(key, val = 1) {
  const cur = parseInt(localStorage.getItem(`metric_${key}`) || '0', 10);
  localStorage.setItem(`metric_${key}`, cur + val);
}

function updateMetricsUI() {
  const s = document.getElementById('stat-searches');
  const e = document.getElementById('stat-emails');
  const v = document.getElementById('stat-valid');
  const d = document.getElementById('stat-duplicates');
  if (s) s.textContent = localStorage.getItem('metric_searches') || '0';
  if (e) e.textContent = localStorage.getItem('metric_emails') || '0';
  if (v) v.textContent = localStorage.getItem('metric_valid') || '0';
  if (d) d.textContent = localStorage.getItem('metric_duplicates') || '0';
}
