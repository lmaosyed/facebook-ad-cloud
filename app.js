document.addEventListener('DOMContentLoaded', () => {
    const loadCampaignsBtn = document.getElementById('loadCampaignsBtn');
    const campaignList = document.getElementById('campaignList');
    const createCampaignForm = document.getElementById('createCampaignForm');
    const campaignNameInput = document.getElementById('campaignName');
    const campaignObjectiveSelect = document.getElementById('campaignObjective');
    const specialAdCategorySelect = document.getElementById('specialAdCategory');
    const updateModal = document.getElementById('updateModal');
    const closeUpdateModal = document.getElementById('closeUpdateModal');
    const updateCampaignForm = document.getElementById('updateCampaignForm');
    const updateCampaignId = document.getElementById('updateCampaignId');
    const updateCampaignName = document.getElementById('updateCampaignName');
    const updateCampaignStatus = document.getElementById('updateCampaignStatus');
    const updateSpecialAdCategory = document.getElementById('updateSpecialAdCategory');
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let campaignIdToDelete = null;
    const viewInsightsBtn = document.getElementById('viewInsightsBtn');
    const insightsList = document.getElementById('insightsList');

    loadCampaignsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/campaigns');
            const data = await response.json();
            campaignList.innerHTML = '';
            if (data.data && data.data.length > 0) {
                data.data.forEach(campaign => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span>${campaign.name} - ${campaign.status}</span>
                        <div class="campaign-actions">
                            <button class="update-btn" data-id="${campaign.id}">Update</button>
                            <button class="delete-btn" data-id="${campaign.id}">Delete</button>
                            <button class="insights-btn" data-id="${campaign.id}">Insights</button>
                            <button onclick="fetchMockInsights('campaign_id')">View Mock Insights</button>
                        </div>`;
                    campaignList.appendChild(listItem);
                });
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', openUpdateModal);
                });
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', openDeleteModal);
                });
                document.querySelectorAll('.insights-btn').forEach(button => {
                    button.addEventListener('click', viewInsights);
                });
            } else {
                campaignList.innerHTML = '<li>No campaigns found.</li>';
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            alert('Error fetching campaigns');
        }
    });

    createCampaignForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = campaignNameInput.value;
        const objective = campaignObjectiveSelect.value;
        const specialAdCategory = specialAdCategorySelect.value;
        const specialAdCategories = specialAdCategory ? [specialAdCategory] : [];
        try {
            const response = await fetch('/create-campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, objective, special_ad_categories: specialAdCategories }),
            });
            const data = await response.json();
            if (data.id) {
                alert('Campaign created successfully!');
                campaignNameInput.value = '';
                campaignObjectiveSelect.value = 'OUTCOME_TRAFFIC';
                specialAdCategorySelect.value = '';
                loadCampaignsBtn.click();
            } else {
                alert('Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Error creating campaign');
        }
    });

    function openUpdateModal(event) {
        const campaignId = event.target.getAttribute('data-id');
        updateCampaignId.value = campaignId;
        fetch(`/campaigns`)
            .then(response => response.json())
            .then(data => {
                const campaign = data.data.find(c => c.id === campaignId);
                if (campaign) {
                    updateCampaignName.value = campaign.name;
                    updateCampaignStatus.value = campaign.status;
                    updateSpecialAdCategory.value = '';
                }
            })
            .catch(error => {
                console.error('Error fetching campaign details:', error);
                alert('Error fetching campaign details');
            });
        updateModal.style.display = 'block';
    }

    closeUpdateModal.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    updateCampaignForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = updateCampaignId.value;
        const name = updateCampaignName.value;
        const status = updateCampaignStatus.value;
        const specialAdCategory = updateSpecialAdCategory.value;
        const special_ad_categories = specialAdCategory ? [specialAdCategory] : [];
        try {
            const response = await fetch(`/update-campaign/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, status, special_ad_categories }),
            });
            const data = await response.json();
            if (data.id) {
                alert('Campaign updated successfully!');
                updateModal.style.display = 'none';
                loadCampaignsBtn.click();
            } else {
                alert('Failed to update campaign');
            }
        } catch (error) {
            console.error('Error updating campaign:', error);
            alert('Error updating campaign');
        }
    });

    function openDeleteModal(event) {
        campaignIdToDelete = event.target.getAttribute('data-id');
        deleteModal.style.display = 'block';
    }

    closeDeleteModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        campaignIdToDelete = null;
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (campaignIdToDelete) {
            try {
                const response = await fetch(`/delete-campaign/${campaignIdToDelete}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    alert('Campaign deleted successfully!');
                    deleteModal.style.display = 'none';
                    loadCampaignsBtn.click();
                } else {
                    alert('Failed to delete campaign');
                }
            } catch (error) {
                console.error('Error deleting campaign:', error);
                alert('Error deleting campaign');
            }
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target == updateModal) {
            updateModal.style.display = 'none';
        }
        if (event.target == deleteModal) {
            deleteModal.style.display = 'none';
        }
    });

    function viewInsights(event) {
        const campaignId = event.target.getAttribute('data-id');
        fetch(`/campaign-insights/${campaignId}`)
            .then(response => response.json())
            .then(data => {
                insightsList.innerHTML = '';
                if (data.data && data.data.length > 0) {
                    data.data.forEach(insight => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>Impressions:</strong> ${insight.impressions || 'N/A'}<br>
                            <strong>Reach:</strong> ${insight.reach || 'N/A'}<br>
                            <strong>Clicks:</strong> ${insight.clicks || 'N/A'}<br>
                            <strong>Spend:</strong> $${(insight.spend / 100).toFixed(2) || 'N/A'}`;
                        insightsList.appendChild(listItem);
                    });
                } else {
                    insightsList.innerHTML = '<li>No insights available.</li>';
                }
            })
            .catch(error => {
                console.error('Error fetching insights:', error);
                alert('Error fetching insights');
            });
    }
});
