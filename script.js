document.getElementById('loadCampaigns').addEventListener('click', loadCampaigns);

function loadCampaigns() {
    fetch('/campaigns')
        .then(response => response.json())
        .then(data => {
            const campaignList = document.getElementById('campaignList');
            campaignList.innerHTML = '';
            data.forEach(campaign => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${campaign.name}</strong> (Status: ${campaign.status})
                    <button onclick="openUpdateModal('${campaign.id}', '${campaign.name}', '${campaign.status}', '${campaign.special_ad_categories[0] || ''}')">Update</button>
                    <button onclick="openDeleteModal('${campaign.id}')">Delete</button>
                    <button onclick="fetchInsights('${campaign.id}')">Insights</button>
                `;
                campaignList.appendChild(li);
            });
        });
}

function openUpdateModal(id, name, status, category) {
    document.getElementById('updateCampaignId').value = id;
    document.getElementById('updateCampaignName').value = name;
    document.getElementById('updateCampaignStatus').value = status;
    document.getElementById('updateSpecialAdCategory').value = category;
    document.getElementById('updateModal').style.display = 'block';
}

document.getElementById('closeUpdateModal').addEventListener('click', () => {
    document.getElementById('updateModal').style.display = 'none';
});

document.getElementById('updateCampaignForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('updateCampaignId').value;
    const name = document.getElementById('updateCampaignName').value;
    const status = document.getElementById('updateCampaignStatus').value;
    const category = document.getElementById('updateSpecialAdCategory').value;

    fetch(`/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, special_ad_categories: [category] })
    }).then(() => {
        document.getElementById('updateModal').style.display = 'none';
        loadCampaigns();
    });
});

function openDeleteModal(id) {
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('confirmDeleteBtn').onclick = function () {
        fetch(`/campaigns/${id}`, { method: 'DELETE' }).then(() => {
            document.getElementById('deleteModal').style.display = 'none';
            loadCampaigns();
        });
    };
    document.getElementById('cancelDeleteBtn').onclick = function () {
        document.getElementById('deleteModal').style.display = 'none';
    };
}

document.getElementById('closeDeleteModal').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none';
});

function fetchInsights(campaignId) {
    fetch(`/insights/${campaignId}`)
        .then(response => response.json())
        .then(data => {
            const insightsList = document.getElementById('insightsList');
            const insightItem = document.createElement('li');
            insightItem.textContent = `Campaign ID: ${campaignId}, Impressions: ${data.impressions}, Clicks: ${data.clicks}, Spend: ${data.spend}`;
            insightsList.appendChild(insightItem);
        });
}
