// ==========================================
    // DATA STRUCTURE (Optimized for Performance)
    // ==========================================

    // Products - Inventory data
    let products = [
        { id: "SP001", name: "Áo thun", quantity: 100, avgCost: 150000, totalValue: 15000000, productType: "NGUYEN_LIEU", recipe: [] },
        { id: "SP002", name: "Quần Jean", quantity: 50, avgCost: 300000, totalValue: 15000000, productType: "NGUYEN_LIEU", recipe: [] },
        { id: "NL001", name: "Hạt cafe", quantity: 5, avgCost: 200000, totalValue: 1000000, productType: "NGUYEN_LIEU", recipe: [] },
        { id: "NL002", name: "Sữa đặc", quantity: 10, avgCost: 40000, totalValue: 400000, productType: "NGUYEN_LIEU", recipe: [] },
        { id: "NL003", name: "Đường", quantity: 20, avgCost: 18000, totalValue: 360000, productType: "NGUYEN_LIEU", recipe: [] },
        { id: "MA001", name: "Cafe sữa đá", quantity: 0, avgCost: 0, totalValue: 0, productType: "MON_AN", recipe: [{ materialId: "NL001", quantityRequired: 0.02 }, { materialId: "NL002", quantityRequired: 0.03 }, { materialId: "NL003", quantityRequired: 0.01 }] },
        { id: "MA002", name: "Cafe đen", quantity: 0, avgCost: 0, totalValue: 0, productType: "MON_AN", recipe: [{ materialId: "NL001", quantityRequired: 0.02 }, { materialId: "NL003", quantityRequired: 0.01 }] }
    ];

    // Fixed assets
    let fixedAssets = [
        { id: "TS001", name: "Máy tính", initialValue: 15000000, months: 36, remainingMonths: 36, remainingValue: 15000000, depreciationPerMonth: 416667, branchId: "CN01" },
        { id: "TS002", name: "Máy photocopy", initialValue: 20000000, months: 60, remainingMonths: 60, remainingValue: 20000000, depreciationPerMonth: 333333, branchId: "CN01" }
    ];

    // Partners
    let partners = [
        { id: "DT001", name: "Công ty A", type: "customer" },
        { id: "DT002", name: "Công ty B", type: "supplier" },
        { id: "DT003", name: "Công ty C", type: "both" }
    ];
    let branches = [
        { id: "CN01", ten_chi_nhanh: "Chi nhánh Quận 1", dia_chi: "Quận 1, TP.HCM", che_do_hach_toan: "chung" },
        { id: "CN02", ten_chi_nhanh: "Chi nhánh Quận 3", dia_chi: "Quận 3, TP.HCM", che_do_hach_toan: "doc_lap" }
    ];
    let branchCounter = 3;
    let productStocksByBranch = {
        CN01: {
            SP001: { quantity: 100, avgCost: 150000, totalValue: 15000000 },
            SP002: { quantity: 50, avgCost: 300000, totalValue: 15000000 },
            NL001: { quantity: 5, avgCost: 200000, totalValue: 1000000 },
            NL002: { quantity: 10, avgCost: 40000, totalValue: 400000 },
            NL003: { quantity: 20, avgCost: 18000, totalValue: 360000 }
        },
        CN02: {
            SP001: { quantity: 0, avgCost: 0, totalValue: 0 },
            SP002: { quantity: 0, avgCost: 0, totalValue: 0 },
            NL001: { quantity: 0, avgCost: 0, totalValue: 0 },
            NL002: { quantity: 0, avgCost: 0, totalValue: 0 },
            NL003: { quantity: 0, avgCost: 0, totalValue: 0 }
        }
    };

    // Master Data: Loại Thu
    let loaiThuList = [
        { id: "LT001", ten_loai: "Doanh thu bán hàng", tai_khoan_no_mac_dinh: null, tai_khoan_co_mac_dinh: "id_511", mo_ta: "Giao dịch này sẽ tính vào Doanh thu của tháng này" },
        { id: "LT002", ten_loai: "Thu nợ khách hàng", tai_khoan_no_mac_dinh: null, tai_khoan_co_mac_dinh: "id_131", mo_ta: "Giao dịch này sẽ giảm Công nợ phải thu" },
        { id: "LT003", ten_loai: "Vốn góp thêm", tai_khoan_no_mac_dinh: null, tai_khoan_co_mac_dinh: "id_411", mo_ta: "Giao dịch này sẽ tăng Vốn chủ sở hữu của công ty" },
    ];

    // Master Data: Loại Chi
    let loaiChiList = [
        { id: "LC001", ten_loai: "Trả lương nhân viên", tai_khoan_no_mac_dinh: "id_642", tai_khoan_co_mac_dinh: null, mo_ta: "Giao dịch này sẽ tính vào Chi phí quản lý của tháng này" },
        { id: "LC002", ten_loai: "Điện nước, Internet", tai_khoan_no_mac_dinh: "id_642", tai_khoan_co_mac_dinh: null, mo_ta: "Giao dịch này sẽ tính vào Chi phí quản lý của tháng này" },
        { id: "LC003", ten_loai: "Trả nợ nhà cung cấp", tai_khoan_no_mac_dinh: "id_331", tai_khoan_co_mac_dinh: null, mo_ta: "Giao dịch này sẽ giảm Công nợ phải trả" },
        { id: "LC004", ten_loai: "Chi phí văn phòng phẩm", tai_khoan_no_mac_dinh: "id_642", tai_khoan_co_mac_dinh: null, mo_ta: "Giao dịch này sẽ tính vào Chi phí quản lý của tháng này" },
    ];

    // Account Map - O(1) lookup
    let accounts = {
        "id_000": { id: "id_000", code: "000", name: "Tài khoản trung gian", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_111": { id: "id_111", code: "111", name: "Tiền mặt", type: "Tài sản", balance: 50000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_112": { id: "id_112", code: "112", name: "Tiền gửi ngân hàng", type: "Tài sản", balance: 100000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_131": { id: "id_131", code: "131", name: "Phải thu khách hàng", type: "Tài sản", balance: 10000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_136": { id: "id_136", code: "136", name: "Phải thu nội bộ", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_133": { id: "id_133", code: "133", name: "Thuế GTGT được khấu trừ", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_152": { id: "id_152", code: "152", name: "Nguyên vật liệu", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_156": { id: "id_156", code: "156", name: "Hàng hóa", type: "Tài sản", balance: 30000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_211": { id: "id_211", code: "211", name: "Tài sản cố định", type: "Tài sản", balance: 35000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_214": { id: "id_214", code: "214", name: "Khấu hao tài sản cố định", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_331": { id: "id_331", code: "331", name: "Phải trả người bán", type: "Nợ phải trả", balance: -20000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_336": { id: "id_336", code: "336", name: "Phải trả nội bộ", type: "Nợ phải trả", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_334": { id: "id_334", code: "334", name: "Phải trả người lao động", type: "Nợ phải trả", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_3331": { id: "id_3331", code: "3331", name: "Thuế GTGT phải nộp", type: "Nợ phải trả", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_3334": { id: "id_3334", code: "3334", name: "Thuế TNDN phải nộp", type: "Nợ phải trả", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_411": { id: "id_411", code: "411", name: "Vốn chủ sở hữu", type: "Vốn chủ sở hữu", balance: -50000000, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_421": { id: "id_421", code: "421", name: "Lợi nhuận", type: "Vốn chủ sở hữu", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_711": { id: "id_711", code: "711", name: "Thu nhập khác", type: "Doanh thu", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_511": { id: "id_511", code: "511", name: "Doanh thu bán hàng", type: "Doanh thu", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_632": { id: "id_632", code: "632", name: "Giá vốn hàng bán", type: "Chi phí", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_642": { id: "id_642", code: "642", name: "Chi phí quản lý", type: "Chi phí", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_811": { id: "id_811", code: "811", name: "Chi phí khác", type: "Chi phí", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_821": { id: "id_821", code: "821", name: "Chi phí thuế thu nhập doanh nghiệp", type: "Chi phí", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
        "id_911": { id: "id_911", code: "911", name: "Xác định kết quả kinh doanh", type: "Tài sản", balance: 0, parentId: null, isParent: false, children: [], defaultChildId: null },
    };
    Object.values(accounts).forEach(account => {
        if (account.branchId === undefined) {
            account.branchId = null;
        }
    });

    // Opening balances for accounts
    let openingBalances = {};

    // Locked periods
    // Shape: { [branchId|'all']: { [YYYY-MM]: { isLocked: boolean, isClosed: boolean } } }
    let lockedPeriods = {};

    // Dynamic closing rules
    let closingRules = [
        { id: "CR001", ten_quy_tac: "Kết chuyển Giá vốn", tai_khoan_nguon: "632", tai_khoan_dich: "911", loai_ket_chuyen: "chi_phi", branchId: null },
        { id: "CR002", ten_quy_tac: "Kết chuyển Chi phí quản lý", tai_khoan_nguon: "642", tai_khoan_dich: "911", loai_ket_chuyen: "chi_phi", branchId: null },
        { id: "CR003", ten_quy_tac: "Kết chuyển Doanh thu", tai_khoan_nguon: "511", tai_khoan_dich: "911", loai_ket_chuyen: "doanh_thu", branchId: null },
        { id: "CR004", ten_quy_tac: "Kết chuyển Thu nhập khác", tai_khoan_nguon: "711", tai_khoan_dich: "911", loai_ket_chuyen: "doanh_thu", branchId: null },
        { id: "CR005", ten_quy_tac: "Kết chuyển Chi phí khác", tai_khoan_nguon: "811", tai_khoan_dich: "911", loai_ket_chuyen: "chi_phi", branchId: null }
    ];
    let closingRuleCounter = 6;

    // Transactions array - uses account IDs (with isLocked property)
    let transactions = [
        { id: "txn_1", date: "2024-01-01", type: "receive", ref: "PT001", desc: "Vốn góp ban đầu", debitAccountId: "id_111", creditAccountId: "id_411", amount: 50000000, isLocked: false, branchId: "CN01" },
        { id: "txn_2", date: "2024-01-02", type: "import", ref: "PNK001", desc: "Nhập kho Áo thun", debitAccountId: "id_156", creditAccountId: "id_331", amount: 15000000, isLocked: false, branchId: "CN01" },
        { id: "txn_3", date: "2024-01-02", type: "import", ref: "PNK001", desc: "Nhập kho Quần Jean", debitAccountId: "id_156", creditAccountId: "id_331", amount: 15000000, isLocked: false, branchId: "CN01" },
        { id: "txn_4", date: "2024-01-03", type: "export", ref: "PXK001", desc: "Bán hàng cho Công ty A (nợ)", debitAccountId: "id_131", creditAccountId: "id_511", amount: 10000000, isLocked: false, branchId: "CN01" },
    ];

    let transactionIdCounter = 4;
    let importCounter = 1;
    let exportCounter = 1;
    let interBranchTransferCounter = 1;
    let fnbOrderCounter = 1;
    const appStorageKey = 'ke_toan_de_dang_state_v1';
    const defaultAppState = JSON.parse(JSON.stringify({
        products,
        fixedAssets,
        partners,
        branches,
        productStocksByBranch,
        loaiThuList,
        loaiChiList,
        accounts,
        openingBalances,
        lockedPeriods,
        closingRules,
        transactions,
        transactionIdCounter,
        importCounter,
        exportCounter,
        interBranchTransferCounter,
        fnbOrderCounter,
        closingRuleCounter,
        branchCounter
    }));

    function getStateSnapshot() {
        return {
            products,
            fixedAssets,
            partners,
            branches,
            productStocksByBranch,
            loaiThuList,
            loaiChiList,
            accounts,
            openingBalances,
            lockedPeriods,
            closingRules,
            transactions,
            transactionIdCounter,
            importCounter,
            exportCounter,
            interBranchTransferCounter,
            fnbOrderCounter,
            closingRuleCounter,
            branchCounter
        };
    }

    function applyStateSnapshot(state) {
        products = state.products || JSON.parse(JSON.stringify(defaultAppState.products));
        fixedAssets = state.fixedAssets || JSON.parse(JSON.stringify(defaultAppState.fixedAssets));
        partners = state.partners || JSON.parse(JSON.stringify(defaultAppState.partners));
        branches = state.branches || JSON.parse(JSON.stringify(defaultAppState.branches));
        productStocksByBranch = state.productStocksByBranch || null;
        loaiThuList = state.loaiThuList || JSON.parse(JSON.stringify(defaultAppState.loaiThuList));
        loaiChiList = state.loaiChiList || JSON.parse(JSON.stringify(defaultAppState.loaiChiList));
        accounts = state.accounts || JSON.parse(JSON.stringify(defaultAppState.accounts));
        openingBalances = state.openingBalances || {};
        lockedPeriods = state.lockedPeriods || {};
        closingRules = state.closingRules || JSON.parse(JSON.stringify(defaultAppState.closingRules));
        transactions = state.transactions || JSON.parse(JSON.stringify(defaultAppState.transactions));
        transactionIdCounter = state.transactionIdCounter || defaultAppState.transactionIdCounter;
        importCounter = state.importCounter || defaultAppState.importCounter;
        exportCounter = state.exportCounter || defaultAppState.exportCounter;
        interBranchTransferCounter = state.interBranchTransferCounter || defaultAppState.interBranchTransferCounter;
        fnbOrderCounter = state.fnbOrderCounter || defaultAppState.fnbOrderCounter;
        closingRuleCounter = state.closingRuleCounter || defaultAppState.closingRuleCounter;
        branchCounter = state.branchCounter || defaultAppState.branchCounter;

        if (!Array.isArray(branches) || branches.length === 0) {
            branches = JSON.parse(JSON.stringify(defaultAppState.branches));
            branchCounter = defaultAppState.branchCounter;
        }

        if (lockedPeriods && typeof lockedPeriods === 'object' && !lockedPeriods.all) {
            const legacyKeys = Object.keys(lockedPeriods);
            const looksLegacy = legacyKeys.some(key => /^\d{4}-\d{2}$/.test(key));
            if (looksLegacy) {
                lockedPeriods = { all: lockedPeriods };
            } else {
                lockedPeriods = { all: {} };
            }
        }
        if (!lockedPeriods || typeof lockedPeriods !== 'object') {
            lockedPeriods = { all: {} };
        }

        if (accounts && accounts.id_156) {
            if (accounts.id_156.code === '152') accounts.id_156.code = '156';
            if (accounts.id_156.name === 'Nguyên vật liệu (Kho thô)') accounts.id_156.name = 'Hàng hóa';
        }

        if (Array.isArray(products)) {
            products = products.map(p => {
                const productType = p.productType || 'NGUYEN_LIEU';
                const recipe = Array.isArray(p.recipe) ? p.recipe : [];
                return { ...p, productType, recipe };
            });
        } else {
            products = JSON.parse(JSON.stringify(defaultAppState.products));
        }

        const hasAnyDish = Array.isArray(products) && products.some(p => p.productType === 'MON_AN');
        if (!hasAnyDish) {
            const seedProducts = (defaultAppState.products || []).filter(p => {
                const id = String(p.id || '');
                return p.productType === 'MON_AN' || id.startsWith('NL');
            });
            seedProducts.forEach(sp => {
                if (!products.some(p => p.id === sp.id)) {
                    products.push(JSON.parse(JSON.stringify(sp)));
                }
            });
        }

        if (Array.isArray(closingRules)) {
            closingRules.forEach(rule => {
                if (rule.branchId === undefined) rule.branchId = null;
            });
        }

        Object.values(accounts).forEach(account => {
            if (account.branchId === undefined) {
                account.branchId = null;
            }
        });

        branches = branches.map(branch => {
            if (branch.ten_chi_nhanh) return branch;
            if (branch.name || branch.code) {
                const normalizedId = typeof branch.id === 'string' && /^CN\d{3}$/.test(branch.id)
                    ? `CN${branch.id.slice(-2)}`
                    : branch.id;
                return {
                    id: normalizedId,
                    ten_chi_nhanh: branch.name || `Chi nhánh ${branch.code || normalizedId}`,
                    dia_chi: branch.note || '',
                    che_do_hach_toan: branch.che_do_hach_toan || 'chung'
                };
            }
            return branch;
        });

        const fallbackBranchId = branches[0]?.id || defaultAppState.branches[0]?.id;
        transactions = transactions.map(txn => {
            let branchId = txn.branchId || fallbackBranchId;
            if (typeof branchId === 'string' && /^CN\d{3}$/.test(branchId)) {
                branchId = `CN${branchId.slice(-2)}`;
            }
            return {
                ...txn,
                branchId
            };
        });

        if (!productStocksByBranch || typeof productStocksByBranch !== 'object') {
            const normalized = {};
            branches.forEach(branch => {
                normalized[branch.id] = {};
                products.filter(product => product.productType !== 'MON_AN').forEach(product => {
                    normalized[branch.id][product.id] = { quantity: 0, avgCost: 0, totalValue: 0 };
                });
            });

            const defaultBranchId = branches[0]?.id;
            if (defaultBranchId) {
                products.filter(product => product.productType !== 'MON_AN').forEach(product => {
                    normalized[defaultBranchId][product.id] = {
                        quantity: product.quantity,
                        avgCost: product.avgCost,
                        totalValue: product.totalValue
                    };
                });
            }
            productStocksByBranch = normalized;
        }

        branches.forEach(branch => {
            if (!productStocksByBranch[branch.id] || typeof productStocksByBranch[branch.id] !== 'object') {
                productStocksByBranch[branch.id] = {};
            }
            products.filter(p => p.productType !== 'MON_AN').forEach(p => {
                if (!productStocksByBranch[branch.id][p.id]) {
                    productStocksByBranch[branch.id][p.id] = { quantity: 0, avgCost: 0, totalValue: 0 };
                }
            });
        });

        const defaultBranchId = branches[0]?.id;
        if (defaultBranchId) {
            products.filter(p => p.productType !== 'MON_AN').forEach(p => {
                const stock = productStocksByBranch[defaultBranchId]?.[p.id];
                if (!stock) return;
                const isEmpty = (stock.quantity || 0) === 0 && (stock.totalValue || 0) === 0 && (stock.avgCost || 0) === 0;
                if (isEmpty && (p.quantity || 0) > 0) {
                    productStocksByBranch[defaultBranchId][p.id] = { quantity: p.quantity, avgCost: p.avgCost, totalValue: p.totalValue };
                }
            });
        }

        fixedAssets = fixedAssets.map(asset => {
            let branchId = asset.branchId || fallbackBranchId;
            if (typeof branchId === 'string' && /^CN\d{3}$/.test(branchId)) {
                branchId = `CN${branchId.slice(-2)}`;
            }
            return { ...asset, branchId };
        });
    }

    function saveState() {
        try {
            localStorage.setItem(appStorageKey, JSON.stringify(getStateSnapshot()));
        } catch (error) {
            console.warn('Không lưu được trạng thái ứng dụng:', error);
        }
    }

    function loadState() {
        try {
            const rawState = localStorage.getItem(appStorageKey);
            if (!rawState) return;

            const parsedState = JSON.parse(rawState);
            applyStateSnapshot(parsedState);
        } catch (error) {
            console.warn('Không đọc được trạng thái đã lưu, dùng dữ liệu mặc định:', error);
            applyStateSnapshot(defaultAppState);
        }
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function formatCurrency(num) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(num));
    }

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    function getPeriodKeyFromDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function getLockedPeriodDataByBranch(branchId, periodKey) {
        const scope = branchId || 'all';
        if (!lockedPeriods || typeof lockedPeriods !== 'object') lockedPeriods = {};
        if (!lockedPeriods[scope] || typeof lockedPeriods[scope] !== 'object') lockedPeriods[scope] = {};
        if (!lockedPeriods[scope][periodKey]) {
            lockedPeriods[scope][periodKey] = { isLocked: false, isClosed: false };
        }
        return lockedPeriods[scope][periodKey];
    }

    function getEffectiveLockedPeriodData(branchId, periodKey) {
        const globalData = getLockedPeriodDataByBranch('all', periodKey);
        const branchData = branchId && branchId !== 'all' ? getLockedPeriodDataByBranch(branchId, periodKey) : { isLocked: false, isClosed: false };
        return {
            isLocked: !!(globalData?.isLocked || branchData?.isLocked),
            isClosed: !!(globalData?.isClosed || branchData?.isClosed)
        };
    }

    // Get display account - handles parent -> default child mapping
    function getDisplayAccount(accountId) {
        let account = accounts[accountId];
        if (!account) return null;
        if (account.isParent && account.defaultChildId) {
            return accounts[account.defaultChildId];
        }
        return account;
    }

    // Get account balance - for parents, sum all children
    function getAccountBalance(accountId) {
        const account = accounts[accountId];
        if (!account) return 0;

        if (account.isParent && account.children.length > 0) {
            let total = 0;
            account.children.forEach(childId => {
                total += getAccountBalance(childId);
            });
            return (account.balance || 0) + total;
        }
        return account.balance;
    }

    function getAccountByCode(code) {
        return Object.values(accounts).find(account => account.code === code) || null;
    }

    function getLeafAccounts(accountId) {
        const account = accounts[accountId];
        if (!account) return [];
        if (!account.isParent || account.children.length === 0) return [account];

        let leafAccounts = [];
        account.children.forEach(childId => {
            leafAccounts = leafAccounts.concat(getLeafAccounts(childId));
        });
        return leafAccounts;
    }

    function getClosingSourceAccounts(sourceCode) {
        const sourceAccount = getAccountByCode(sourceCode);
        if (!sourceAccount) return [];
        return getLeafAccounts(sourceAccount.id);
    }

    function getAccountLabelByCode(code) {
        const account = getAccountByCode(code);
        return account ? `${account.code} - ${account.name}` : code;
    }

    // Update account 156 (Hàng hóa) balance from products
    function updateInventoryAccount() {
        let totalInventoryValue = 0;
        products.filter(p => p.productType !== 'MON_AN').forEach(p => {
            totalInventoryValue += p.totalValue;
        });
        accounts["id_156"].balance = totalInventoryValue;
    }

    function getBranchProductStock(branchId, productId) {
        if (!productStocksByBranch[branchId]) {
            productStocksByBranch[branchId] = {};
        }
        if (!productStocksByBranch[branchId][productId]) {
            productStocksByBranch[branchId][productId] = { quantity: 0, avgCost: 0, totalValue: 0 };
        }
        return productStocksByBranch[branchId][productId];
    }

    function syncGlobalProductsFromBranchStocks() {
        products.forEach(product => {
            if (product.productType === 'MON_AN') {
                product.quantity = 0;
                product.totalValue = 0;
                product.avgCost = 0;
                return;
            }
            let totalQty = 0;
            let totalValue = 0;

            branches.forEach(branch => {
                const stock = getBranchProductStock(branch.id, product.id);
                totalQty += stock.quantity;
                totalValue += stock.totalValue;
            });

            product.quantity = totalQty;
            product.totalValue = totalValue;
            product.avgCost = totalQty > 0 ? totalValue / totalQty : 0;
        });
    }

    // Update account 211 (TSCĐ) from fixed assets
    function updateFixedAssetAccount() {
        let totalAssetValue = 0;
        fixedAssets.forEach(a => {
            totalAssetValue += a.initialValue;
        });
        accounts["id_211"].balance = totalAssetValue;
    }

    // ==========================================
    // PARTNER MANAGEMENT
    // ==========================================
    function showAddPartnerModal() {
        document.getElementById('partner-modal').classList.remove('hidden');
        document.getElementById('partner-modal').classList.add('flex');
    }

    function hideAddPartnerModal() {
        document.getElementById('partner-modal').classList.add('hidden');
        document.getElementById('partner-modal').classList.remove('flex');
        document.getElementById('form-add-partner').reset();
    }

    function addPartner() {
        const name = document.getElementById('partner-name').value.trim();
        const type = document.getElementById('partner-type').value;
        if (!name) return;

        partners.push({
            id: `DT${String(partners.length + 1).padStart(3, '0')}`,
            name,
            type
        });
        hideAddPartnerModal();
        renderAll();
    }

    function populatePartnerSelects() {
        const selects = ['recv-partner', 'pay-partner', 'import-partner', 'export-partner', 'fnb-partner'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            const currentValue = select.value;
            select.innerHTML = '<option value="">-- Chọn đối tác --</option>';
            partners.forEach(partner => {
                const option = document.createElement('option');
                option.value = partner.id;
                option.textContent = partner.name;
                select.appendChild(option);
            });
            select.value = currentValue;
        });
    }

    function getPartnerById(id) {
        return partners.find(p => p.id === id);
    }

    // ==========================================
    // BRANCH MANAGEMENT
    // ==========================================
    function getDefaultBranchId() {
        return branches[0]?.id || 'CN01';
    }

    function getBranchById(id) {
        return branches.find(branch => branch.id === id) || null;
    }

    function getBranchLabelById(id) {
        const branch = getBranchById(id);
        return branch ? `${branch.id} - ${branch.ten_chi_nhanh}` : 'Không xác định';
    }

    function getSelectedBranchId(selectId) {
        const select = document.getElementById(selectId);
        return select?.value || 'all';
    }

    function getTransactionsByBranch(branchId = 'all') {
        if (!branchId || branchId === 'all') return transactions;
        return transactions.filter(txn => txn.branchId === branchId);
    }

    function getAccountBalanceByBranch(accountId, branchId = 'all') {
        const account = accounts[accountId];
        if (!account) return 0;

        if ((!branchId || branchId === 'all') && account.isParent && account.children.length > 0) {
            return getAccountBalance(accountId);
        }

        if (account.isParent && account.children.length > 0) {
            let ownBalance = 0;
            getTransactionsByBranch(branchId).forEach(txn => {
                if (txn.debitAccountId === accountId) ownBalance += txn.amount;
                if (txn.creditAccountId === accountId) ownBalance -= txn.amount;
            });
            return ownBalance + account.children.reduce((sum, childId) => sum + getAccountBalanceByBranch(childId, branchId), 0);
        }

        let balance = 0;
        getTransactionsByBranch(branchId).forEach(txn => {
            if (txn.debitAccountId === accountId) balance += txn.amount;
            if (txn.creditAccountId === accountId) balance -= txn.amount;
        });
        return balance;
    }

    function populateBranchSelect(selectId, includeAll = false) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentValue = select.value;
        if (includeAll && selectId === 'closing-config-branch-filter') {
            select.innerHTML = '<option value="all">Mặc định (áp dụng chung)</option>';
        } else {
            select.innerHTML = includeAll ? '<option value="all">Toàn công ty</option>' : '';
        }

        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = `${branch.id} - ${branch.ten_chi_nhanh}`;
            select.appendChild(option);
        });

        const fallbackValue = includeAll ? 'all' : getDefaultBranchId();
        select.value = currentValue && Array.from(select.options).some(option => option.value === currentValue)
            ? currentValue
            : fallbackValue;
    }

    function populateBranchSelects() {
        ['recv-branch', 'pay-branch', 'import-branch', 'export-branch', 'asset-branch', 'ibt-from-branch', 'ibt-to-branch', 'fnb-branch'].forEach(selectId => populateBranchSelect(selectId, false));
        [
            'dashboard-branch-filter',
            'accounts-branch-filter',
            'inventory-branch-filter',
            'journal-branch-filter',
            'ledger-branch-filter',
            'receivables-branch-filter',
            'cashflow-branch-filter',
            'balance-branch-filter',
            'closing-branch-filter',
            'closing-config-branch-filter',
            'lock-period-branch-filter',
            'invoices-branch-filter',
            'vouchers-branch-filter'
        ].forEach(selectId => populateBranchSelect(selectId, true));
    }

    function renderBranches() {
        const tbody = document.getElementById('branches-table');
        if (!tbody) return;

        tbody.innerHTML = '';
        branches.forEach(branch => {
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 font-mono text-cyan-300">${branch.id}</td>
                    <td class="p-4 text-slate-200 font-medium">${branch.ten_chi_nhanh}</td>
                    <td class="p-4 text-slate-400">${branch.dia_chi || ''}</td>
                    <td class="p-4">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${branch.che_do_hach_toan === 'doc_lap' ? 'bg-pink-900/40 text-pink-300' : 'bg-slate-700 text-slate-200'}">
                            ${branch.che_do_hach_toan === 'doc_lap' ? 'Độc lập' : 'Chung'}
                        </span>
                    </td>
                </tr>
            `);
        });
    }

    function addBranch() {
        const nameInput = document.getElementById('branch-name');
        const addressInput = document.getElementById('branch-address');
        const modeInput = document.getElementById('branch-mode');
        if (!nameInput || !addressInput || !modeInput) return;

        const ten_chi_nhanh = nameInput.value.trim();
        const dia_chi = addressInput.value.trim();
        const che_do_hach_toan = modeInput.value;

        if (!ten_chi_nhanh) {
            alert('Vui lòng nhập tên chi nhánh!');
            return;
        }

        const duplicate = branches.find(branch => (branch.ten_chi_nhanh || '').toLowerCase() === ten_chi_nhanh.toLowerCase());
        if (duplicate) {
            alert('Chi nhánh này đã tồn tại!');
            return;
        }

        branches.push({
            id: `CN${String(branchCounter++).padStart(2, '0')}`,
            ten_chi_nhanh,
            dia_chi,
            che_do_hach_toan
        });

        const newBranchId = branches[branches.length - 1].id;
        if (!productStocksByBranch[newBranchId]) {
            productStocksByBranch[newBranchId] = {};
            products.forEach(product => {
                productStocksByBranch[newBranchId][product.id] = { quantity: 0, avgCost: 0, totalValue: 0 };
            });
        }

        document.getElementById('form-add-branch')?.reset();
        renderBranches();
        populateBranchSelects();
        saveState();
        alert('Đã thêm chi nhánh mới!');
    }

    function populateLoaiThuSelect() {
        const select = document.getElementById('recv-loai-thu');
        if (!select) return;
        select.innerHTML = '';
        loaiThuList.forEach(loai => {
            const option = document.createElement('option');
            option.value = loai.id;
            option.textContent = loai.ten_loai;
            select.appendChild(option);
        });
    }

    function populateLoaiChiSelect() {
        const select = document.getElementById('pay-loai-chi');
        if (!select) return;
        select.innerHTML = '';
        loaiChiList.forEach(loai => {
            const option = document.createElement('option');
            option.value = loai.id;
            option.textContent = loai.ten_loai;
            select.appendChild(option);
        });
    }

    function showRecvHelp() {
        const loaiId = document.getElementById('recv-loai-thu').value;
        const partnerId = document.getElementById('recv-partner').value;
        const amount = parseFloat(document.getElementById('recv-amount').value) || 0;
        const partner = getPartnerById(partnerId);
        const loai = loaiThuList.find(l => l.id === loaiId);
        
        let message = `<div class="space-y-4">
            <div class="p-3 rounded-lg bg-blue-900/30 border border-blue-700/50">
                <h4 class="font-semibold text-blue-300 mb-2">📖 Bản chất nghiệp vụ</h4>
                <p class="text-slate-300 text-sm">${loai ? loai.mo_ta : 'Chọn loại phiếu để xem chi tiết'}</p>
            </div>
            <div class="p-3 rounded-lg bg-purple-900/30 border border-purple-700/50">
                <h4 class="font-semibold text-purple-300 mb-2">🔍 Nguồn gốc dữ liệu</h4>
                <p class="text-slate-300 text-sm">
                    Số tiền: ${amount > 0 ? formatCurrency(amount) : 'Chưa nhập'} <br>
                    Đối tác: ${partner ? partner.name : 'Chưa chọn'}
                </p>
            </div>
            <div class="p-3 rounded-lg bg-green-900/30 border border-green-700/50">
                <h4 class="font-semibold text-green-300 mb-2">🔄 Tác động hệ thống</h4>
                <p class="text-slate-300 text-sm">
                    Sau khi lưu, phiếu sẽ được ghi vào Sổ Nhật Ký, cập nhật số dư tài khoản và các báo cáo liên quan!
                </p>
            </div>
        </div>`;

        alert(message.replace(/<[^>]*>/g, '')); // Temporary, use a modal next time
    }

    function toggleRecvCustomAccounts() {
        const div = document.getElementById('recv-custom-accounts');
        div.classList.toggle('hidden');
        updateRecvPreview();
    }

    function togglePayCustomAccounts() {
        const div = document.getElementById('pay-custom-accounts');
        div.classList.toggle('hidden');
        updatePayPreview();
    }

    function toggleImportCustomAccounts() {
        const div = document.getElementById('import-custom-accounts');
        div.classList.toggle('hidden');
        updateImportPreview();
    }

    function toggleExportCustomAccounts() {
        const div = document.getElementById('export-custom-accounts');
        div.classList.toggle('hidden');
        updateExportPreview();
    }

    function updateRecvPreview() {
        const previewContentDiv = document.getElementById('recv-preview-content');
        const loaiId = document.getElementById('recv-loai-thu')?.value;
        const phuongThucId = document.getElementById('recv-phuong-thuc-tt')?.value;
        const amount = parseFloat(document.getElementById('recv-amount')?.value) || 0;
        const customDiv = document.getElementById('recv-custom-accounts');
        let debitAccountId, creditAccountId;
        
        if (customDiv && customDiv.classList.contains('hidden')) {
            // Use default accounts
            debitAccountId = phuongThucId;
            const loai = loaiThuList.find(l => l.id === loaiId);
            creditAccountId = loai ? loai.tai_khoan_co_mac_dinh : null;
        } else {
            // Use custom accounts
            debitAccountId = document.getElementById('recv-debit')?.value;
            creditAccountId = document.getElementById('recv-credit')?.value;
        }
        
        const debitAccount = debitAccountId ? accounts[debitAccountId] : null;
        const creditAccount = creditAccountId ? accounts[creditAccountId] : null;
        
        if (!previewContentDiv || !amount || !debitAccount || !creditAccount) {
            previewContentDiv.innerHTML = `
                <p class="text-slate-300 italic">Vui lòng điền đầy đủ thông tin để xem trước!</p>
            `;
            return;
        }
        
        previewContentDiv.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-slate-400 border-b border-slate-700">
                            <th class="py-2 text-left">Tài khoản Nợ</th>
                            <th class="py-2 text-right">Số tiền Nợ</th>
                            <th class="py-2 text-left">Tài khoản Có</th>
                            <th class="py-2 text-right">Số tiền Có</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${debitAccount.code} - ${debitAccount.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(amount)}</td>
                            <td class="py-2 text-red-300">${creditAccount.code} - ${creditAccount.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(amount)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function updateRecvExplanation() {
        const select = document.getElementById('recv-loai-thu');
        const explanationDiv = document.getElementById('recv-explanation');
        const defaultEntriesDiv = document.getElementById('recv-default-entries');
        if (!select || !explanationDiv) return;

        const loai = loaiThuList.find(l => l.id === select.value);
        if (loai) {
            explanationDiv.innerHTML = `📝 ${loai.mo_ta}`;
            if (defaultEntriesDiv) {
                const debitAccountId = document.getElementById('recv-phuong-thuc-tt')?.value || 'id_111';
                const debitAccount = accounts[debitAccountId];
                const creditAccount = accounts[loai.tai_khoan_co_mac_dinh];
                defaultEntriesDiv.innerHTML = `
                    <div class="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-700/30">
                        <span class="text-green-300"><strong>Nợ:</strong> ${debitAccount.code} - ${debitAccount.name}</span>
                        <span class="text-red-300"><strong>Có:</strong> ${creditAccount.code} - ${creditAccount.name}</span>
                    </div>
                `;
            }
            // Also update the custom account selects to default values
            const debitSelect = document.getElementById('recv-debit');
            const creditSelect = document.getElementById('recv-credit');
            if (debitSelect) debitSelect.value = document.getElementById('recv-phuong-thuc-tt')?.value || 'id_111';
            if (creditSelect) creditSelect.value = loai.tai_khoan_co_mac_dinh;
        }
        updateRecvPreview();
        updateRecvAmount();
    }

    function showPayHelp() {
        const loaiId = document.getElementById('pay-loai-chi').value;
        const partnerId = document.getElementById('pay-partner').value;
        const amount = parseFloat(document.getElementById('pay-amount').value) || 0;
        const partner = getPartnerById(partnerId);
        const loai = loaiChiList.find(l => l.id === loaiId);
        
        let message = `📖 Bản chất nghiệp vụ:\n${loai ? loai.mo_ta : 'Chọn loại phiếu để xem chi tiết'}\n\n🔍 Nguồn gốc dữ liệu:\nSố tiền: ${amount > 0 ? amount.toLocaleString('vi-VN') : 'Chưa nhập'}\nĐối tác: ${partner ? partner.name : 'Chưa chọn'}\n\n🔄 Tác động hệ thống:\nSau khi lưu, phiếu sẽ được ghi vào Sổ Nhật Ký, cập nhật số dư tài khoản và các báo cáo liên quan!`;
        alert(message);
    }

    function updatePayPreview() {
        const previewContentDiv = document.getElementById('pay-preview-content');
        const loaiId = document.getElementById('pay-loai-chi')?.value;
        const phuongThucId = document.getElementById('pay-phuong-thuc-tt')?.value;
        const amount = parseFloat(document.getElementById('pay-amount')?.value) || 0;
        const customDiv = document.getElementById('pay-custom-accounts');
        let debitAccountId, creditAccountId;
        
        if (customDiv && customDiv.classList.contains('hidden')) {
            // Use default accounts
            const loai = loaiChiList.find(l => l.id === loaiId);
            debitAccountId = loai ? loai.tai_khoan_no_mac_dinh : null;
            creditAccountId = phuongThucId;
        } else {
            // Use custom accounts
            debitAccountId = document.getElementById('pay-debit')?.value;
            creditAccountId = document.getElementById('pay-credit')?.value;
        }
        
        const debitAccount = debitAccountId ? accounts[debitAccountId] : null;
        const creditAccount = creditAccountId ? accounts[creditAccountId] : null;
        
        if (!previewContentDiv || !amount || !debitAccount || !creditAccount) {
            previewContentDiv.innerHTML = `
                <p class="text-slate-300 italic">Vui lòng điền đầy đủ thông tin để xem trước!</p>
            `;
            return;
        }
        
        previewContentDiv.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-slate-400 border-b border-slate-700">
                            <th class="py-2 text-left">Tài khoản Nợ</th>
                            <th class="py-2 text-right">Số tiền Nợ</th>
                            <th class="py-2 text-left">Tài khoản Có</th>
                            <th class="py-2 text-right">Số tiền Có</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${debitAccount.code} - ${debitAccount.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(amount)}</td>
                            <td class="py-2 text-red-300">${creditAccount.code} - ${creditAccount.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(amount)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function updatePayExplanation() {
        const select = document.getElementById('pay-loai-chi');
        const explanationDiv = document.getElementById('pay-explanation');
        const defaultEntriesDiv = document.getElementById('pay-default-entries');
        if (!select || !explanationDiv) return;

        const loai = loaiChiList.find(l => l.id === select.value);
        if (loai) {
            explanationDiv.innerHTML = `📝 ${loai.mo_ta}`;
            if (defaultEntriesDiv) {
                const debitAccount = accounts[loai.tai_khoan_no_mac_dinh];
                const creditAccountId = document.getElementById('pay-phuong-thuc-tt')?.value || 'id_111';
                const creditAccount = accounts[creditAccountId];
                defaultEntriesDiv.innerHTML = `
                    <div class="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-700/30">
                        <span class="text-green-300"><strong>Nợ:</strong> ${debitAccount.code} - ${debitAccount.name}</span>
                        <span class="text-red-300"><strong>Có:</strong> ${creditAccount.code} - ${creditAccount.name}</span>
                    </div>
                `;
            }
            // Also update the custom account selects to default values
            const debitSelect = document.getElementById('pay-debit');
            const creditSelect = document.getElementById('pay-credit');
            if (debitSelect) debitSelect.value = loai.tai_khoan_no_mac_dinh;
            if (creditSelect) creditSelect.value = document.getElementById('pay-phuong-thuc-tt')?.value || 'id_111';
        }
        updatePayPreview();
        updatePayAmount();
    }

    function updateRecvAmount() {
        const loaiId = document.getElementById('recv-loai-thu')?.value;
        const partnerId = document.getElementById('recv-partner')?.value;
        if (loaiId === 'LT002' && partnerId) { // Thu nợ khách hàng
            // Auto fill with 131's balance (as an example, since we don't track per partner)
            const receivableBalance = accounts['id_131'].balance;
            document.getElementById('recv-amount').value = receivableBalance > 0 ? receivableBalance : '';
        }
    }

    function updatePayAmount() {
        const loaiId = document.getElementById('pay-loai-chi')?.value;
        const partnerId = document.getElementById('pay-partner')?.value;
        if (loaiId === 'LC003' && partnerId) { // Trả nợ nhà cung cấp
            // Auto fill with 331's absolute balance (since credit is negative)
            const payableBalance = -accounts['id_331'].balance;
            document.getElementById('pay-amount').value = payableBalance > 0 ? payableBalance : '';
        }
    }

    function updateImportPreview() {
        const previewContentDiv = document.getElementById('import-preview-content');
        const customDiv = document.getElementById('import-custom-accounts');
        if (!previewContentDiv) return;
        
        // Calculate totals from product rows
        const container = document.getElementById('import-products');
        const rows = container.querySelectorAll('.product-row');
        let totalInventory = 0;
        let totalVAT = 0;
        const vatRate = parseFloat(document.getElementById('import-vat').value) / 100;
        
        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            const lineTotal = qty * price;
            totalInventory += lineTotal;
            totalVAT += lineTotal * vatRate;
        });
        
        if (totalInventory <= 0 && totalVAT <= 0) {
            previewContentDiv.innerHTML = `
                <p class="text-slate-300 italic">Vui lòng thêm mặt hàng để xem trước!</p>
            `;
            return;
        }
        
        // Get accounts
        let invDebitId, vatDebitId, payCreditId;
        if (customDiv && customDiv.classList.contains('hidden')) {
            const paymentMethod = document.getElementById('import-payment').value;
            invDebitId = 'id_156';
            vatDebitId = 'id_133';
            payCreditId = paymentMethod === 'cash' ? 'id_111' : 'id_331';
        } else {
            invDebitId = document.getElementById('import-debit-inventory')?.value;
            vatDebitId = document.getElementById('import-debit-vat')?.value;
            payCreditId = document.getElementById('import-credit-pay')?.value;
        }
        
        const invDebitAcc = invDebitId ? accounts[invDebitId] : null;
        const vatDebitAcc = vatDebitId ? accounts[vatDebitId] : null;
        const payCreditAcc = payCreditId ? accounts[payCreditId] : null;
        
        if (!invDebitAcc || !payCreditAcc) return;
        
        let previewHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-slate-400 border-b border-slate-700">
                            <th class="py-2 text-left">Tài khoản Nợ</th>
                            <th class="py-2 text-right">Số tiền Nợ</th>
                            <th class="py-2 text-left">Tài khoản Có</th>
                            <th class="py-2 text-right">Số tiền Có</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${invDebitAcc.code} - ${invDebitAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalInventory)}</td>
                            <td class="py-2 text-red-300">${payCreditAcc.code} - ${payCreditAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalInventory)}</td>
                        </tr>
        `;
        
        if (totalVAT > 0 && vatDebitAcc) {
            previewHTML += `
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${vatDebitAcc.code} - ${vatDebitAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalVAT)}</td>
                            <td class="py-2 text-red-300">${payCreditAcc.code} - ${payCreditAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalVAT)}</td>
                        </tr>
            `;
        }
        
        previewHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        previewContentDiv.innerHTML = previewHTML;
    }

    function updateExportPreview() {
        const previewContentDiv = document.getElementById('export-preview-content');
        const customDiv = document.getElementById('export-custom-accounts');
        if (!previewContentDiv) return;
        
        // Calculate totals from product rows
        const container = document.getElementById('export-products');
        const rows = container.querySelectorAll('.product-row');
        let totalRevenue = 0;
        let totalCOGS = 0;
        let totalVAT = 0;
        const vatRate = parseFloat(document.getElementById('export-vat').value) / 100;
        
        rows.forEach(row => {
            const productId = row.querySelector('.product-select').value;
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            const product = products.find(p => p.id === productId);
            
            const lineRevenue = qty * price;
            const lineCOGS = qty * (product?.avgCost || 0);
            
            totalRevenue += lineRevenue;
            totalCOGS += lineCOGS;
            totalVAT += lineRevenue * vatRate;
        });
        
        if (totalRevenue <= 0) {
            previewContentDiv.innerHTML = `
                <p class="text-slate-300 italic">Vui lòng thêm mặt hàng để xem trước!</p>
            `;
            return;
        }
        
        // Get accounts
        let cogsDebitId, invCreditId, payDebitId, revCreditId, vatCreditId;
        if (customDiv && customDiv.classList.contains('hidden')) {
            const paymentMethod = document.getElementById('export-payment').value;
            cogsDebitId = 'id_632';
            invCreditId = 'id_156';
            payDebitId = paymentMethod === 'cash' ? 'id_111' : 'id_131';
            revCreditId = 'id_511';
            vatCreditId = 'id_3331';
        } else {
            cogsDebitId = document.getElementById('export-debit-cogs')?.value;
            invCreditId = document.getElementById('export-credit-inventory')?.value;
            payDebitId = document.getElementById('export-debit-pay')?.value;
            revCreditId = document.getElementById('export-credit-revenue')?.value;
            vatCreditId = document.getElementById('export-credit-vat')?.value;
        }
        
        const cogsDebitAcc = cogsDebitId ? accounts[cogsDebitId] : null;
        const invCreditAcc = invCreditId ? accounts[invCreditId] : null;
        const payDebitAcc = payDebitId ? accounts[payDebitId] : null;
        const revCreditAcc = revCreditId ? accounts[revCreditId] : null;
        const vatCreditAcc = vatCreditId ? accounts[vatCreditId] : null;
        
        if (!cogsDebitAcc || !invCreditAcc || !payDebitAcc || !revCreditAcc) return;
        
        let previewHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-slate-400 border-b border-slate-700">
                            <th class="py-2 text-left">Tài khoản Nợ</th>
                            <th class="py-2 text-right">Số tiền Nợ</th>
                            <th class="py-2 text-left">Tài khoản Có</th>
                            <th class="py-2 text-right">Số tiền Có</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // COGS entry
        if (totalCOGS > 0) {
            previewHTML += `
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${cogsDebitAcc.code} - ${cogsDebitAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalCOGS)}</td>
                            <td class="py-2 text-red-300">${invCreditAcc.code} - ${invCreditAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalCOGS)}</td>
                        </tr>
            `;
        }
        
        // Revenue entry
        previewHTML += `
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-green-300">${payDebitAcc.code} - ${payDebitAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalRevenue + totalVAT)}</td>
                            <td class="py-2 text-red-300">${revCreditAcc.code} - ${revCreditAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalRevenue)}</td>
                        </tr>
        `;
        
        // VAT entry
        if (totalVAT > 0 && vatCreditAcc) {
            previewHTML += `
                        <tr class="border-b border-slate-700/50">
                            <td class="py-2 text-slate-400"></td>
                            <td class="py-2 text-right font-mono text-slate-400"></td>
                            <td class="py-2 text-red-300">${vatCreditAcc.code} - ${vatCreditAcc.name}</td>
                            <td class="py-2 text-right font-mono text-slate-200">${formatCurrency(totalVAT)}</td>
                        </tr>
            `;
        }
        
        previewHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        previewContentDiv.innerHTML = previewHTML;
    }

    // ==========================================
    // FIXED ASSET MANAGEMENT
    // ==========================================
    function addFixedAsset() {
        const name = document.getElementById('asset-name').value.trim();
        const value = parseFloat(document.getElementById('asset-value').value) || 0;
        const months = parseInt(document.getElementById('asset-months').value) || 36;
        const branchId = document.getElementById('asset-branch')?.value || getDefaultBranchId();
        if (!name || value <= 0) return;

        const depreciation = Math.floor(value / months);
        fixedAssets.push({
            id: `TS${String(fixedAssets.length + 1).padStart(3, '0')}`,
            name,
            initialValue: value,
            months,
            remainingMonths: months,
            remainingValue: value,
            depreciationPerMonth: depreciation,
            branchId
        });

        // Add transaction for asset purchase
        addTransaction(getToday(), 'receive', `PTS${String(fixedAssets.length).padStart(3, '0')}`, `Mua ${name}`, 'id_211', 'id_111', value, branchId);
        updateFixedAssetAccount();
        document.getElementById('form-add-asset').reset();
        renderAll();
    }

    // ==========================================
    // ACCOUNT MANAGEMENT
    // ==========================================
    function hasAccountJournalActivity(accountId) {
        return transactions.some(t => t.debitAccountId === accountId || t.creditAccountId === accountId);
    }

    function hasAccountJournalActivityInBranch(accountId, branchId) {
        return transactions.some(t => (t.debitAccountId === accountId || t.creditAccountId === accountId) && t.branchId === branchId);
    }

    function getAccountBranchId(account) {
        return account?.branchId === undefined ? null : account.branchId;
    }

    function hasBranchSpecificChildren(parentAccountId, branchId) {
        const parentAccount = accounts[parentAccountId];
        if (!parentAccount || !Array.isArray(parentAccount.children)) return false;
        return parentAccount.children.some(childId => {
            const child = accounts[childId];
            return child && getAccountBranchId(child) === branchId;
        });
    }

    function isAccountSelectableInBranch(account, branchId) {
        const accountBranchId = getAccountBranchId(account);
        if (!branchId || branchId === 'all') return true;
        if (accountBranchId !== null && accountBranchId !== branchId) return false;
        if (accountBranchId === null && hasBranchSpecificChildren(account.id, branchId)) return false;
        return true;
    }

    function isAccountVisibleInBranch(account, branchId) {
        const accountBranchId = getAccountBranchId(account);
        if (!branchId || branchId === 'all') return true;
        return accountBranchId === null || accountBranchId === branchId;
    }

    function generateUniqueAccountId(baseId) {
        if (!accounts[baseId]) return baseId;
        let i = 2;
        while (accounts[`${baseId}_${i}`]) i++;
        return `${baseId}_${i}`;
    }

    function isAccountCodeTaken(code, branchId = null) {
        return Object.values(accounts).some(acc => acc.code === code && getAccountBranchId(acc) === branchId);
    }

    function createBranchIsolatedSubAccount(parentAccountId, subAccountCode, subAccountName, branchId) {
        const parentAccount = accounts[parentAccountId];
        if (!parentAccount) {
            alert('Không tìm thấy tài khoản cha!');
            return null;
        }
        if (!branchId || branchId === 'all') {
            alert('Vui lòng chọn chi nhánh để tạo tài khoản con riêng cho chi nhánh!');
            return null;
        }
        if (!subAccountCode || !subAccountName) {
            alert('Vui lòng nhập mã và tên tài khoản con!');
            return null;
        }
        if (isAccountCodeTaken(subAccountCode, branchId)) {
            alert('Mã tài khoản đã tồn tại trong chi nhánh này!');
            return null;
        }

        const parentCode = parentAccount.code;
        const parentName = parentAccount.name;
        const parentBranchBalance = getAccountBalanceByBranch(parentAccountId, branchId);

        let defaultBranchChildId = null;
        if (parentBranchBalance !== 0) {
            const defaultCode = `${parentCode}0`;
            defaultBranchChildId = Object.values(accounts).find(acc =>
                acc.code === defaultCode &&
                getAccountBranchId(acc) === branchId &&
                acc.parentId === parentAccountId
            )?.id || null;

            if (!defaultBranchChildId) {
                defaultBranchChildId = generateUniqueAccountId(`id_${defaultCode}_${branchId}`);
                accounts[defaultBranchChildId] = {
                    id: defaultBranchChildId,
                    code: defaultCode,
                    name: `${parentName} - Khác (${branchId})`,
                    type: parentAccount.type,
                    balance: 0,
                    parentId: parentAccountId,
                    isParent: false,
                    children: [],
                    defaultChildId: null,
                    branchId
                };
                parentAccount.children = parentAccount.children || [];
                if (!parentAccount.children.includes(defaultBranchChildId)) {
                    parentAccount.children.push(defaultBranchChildId);
                }
                parentAccount.isParent = true;
            }

            const adjustmentAmount = Math.abs(parentBranchBalance);
            const adjustmentDebitId = parentBranchBalance > 0 ? defaultBranchChildId : parentAccountId;
            const adjustmentCreditId = parentBranchBalance > 0 ? parentAccountId : defaultBranchChildId;

            addTransaction(
                getToday(),
                'internal',
                `ADJ${String(transactionIdCounter).padStart(3, '0')}`,
                `Điều chỉnh tách ${parentCode} -> ${defaultCode} (${branchId})`,
                adjustmentDebitId,
                adjustmentCreditId,
                adjustmentAmount,
                branchId
            );
        }

        const newChildId = generateUniqueAccountId(`id_${subAccountCode}_${branchId}`);
        accounts[newChildId] = {
            id: newChildId,
            code: subAccountCode,
            name: subAccountName,
            type: parentAccount.type,
            balance: 0,
            parentId: parentAccountId,
            isParent: false,
            children: [],
            defaultChildId: null,
            branchId
        };

        parentAccount.children = parentAccount.children || [];
        if (!parentAccount.children.includes(newChildId)) {
            parentAccount.children.push(newChildId);
        }
        parentAccount.isParent = true;

        return newChildId;
    }

    function createNewSubAccount(parentAccountId, subAccountCode, subAccountName) {
        const parentAccount = accounts[parentAccountId];
        if (!parentAccount) {
            alert('Không tìm thấy tài khoản cha!');
            return null;
        }

        if (!subAccountCode || !subAccountName) {
            alert('Vui lòng nhập mã và tên tài khoản con!');
            return null;
        }

        if (isAccountCodeTaken(subAccountCode, null)) {
            alert('Mã tài khoản đã tồn tại!');
            return null;
        }

        const parentHasActivity = Math.abs(parentAccount.balance) > 0 || hasAccountJournalActivity(parentAccountId);
        const needsConvert = parentHasActivity && (!parentAccount.isParent || parentAccount.children.length === 0);

        let effectiveParentId = parentAccountId;
        let effectiveParent = parentAccount;

        if (needsConvert) {
            const originalCode = parentAccount.code;
            const originalName = parentAccount.name;
            const originalType = parentAccount.type;
            const originalParentId = parentAccount.parentId;

            const newParentId = generateUniqueAccountId(`${parentAccountId}_new_parent`);

            parentAccount.code = `${originalCode}0`;
            parentAccount.name = `${originalName} - Khác`;
            parentAccount.parentId = newParentId;
            parentAccount.isParent = false;
            parentAccount.children = [];
            parentAccount.defaultChildId = null;

            accounts[newParentId] = {
                id: newParentId,
                code: originalCode,
                name: originalName,
                type: originalType,
                balance: 0,
                parentId: originalParentId || null,
                isParent: true,
                children: [parentAccountId],
                defaultChildId: parentAccountId
            };

            if (originalParentId && accounts[originalParentId]) {
                const parentOfParent = accounts[originalParentId];
                const idx = parentOfParent.children.indexOf(parentAccountId);
                if (idx >= 0) parentOfParent.children[idx] = newParentId;
                if (parentOfParent.defaultChildId === parentAccountId) {
                    parentOfParent.defaultChildId = newParentId;
                }
                parentOfParent.isParent = true;
            }

            effectiveParentId = newParentId;
            effectiveParent = accounts[newParentId];
        } else {
            if (effectiveParent.children.length > 0) {
                effectiveParent.isParent = true;
            }
        }

        const newChildId = generateUniqueAccountId(`id_${subAccountCode}_new`);
        accounts[newChildId] = {
            id: newChildId,
            code: subAccountCode,
            name: subAccountName,
            type: effectiveParent.type,
            balance: 0,
            parentId: effectiveParentId,
            isParent: false,
            children: [],
            defaultChildId: null
        };

        effectiveParent.children = effectiveParent.children || [];
        effectiveParent.children.push(newChildId);
        effectiveParent.isParent = true;

        return newChildId;
    }

    function addAccount() {
        const code = document.getElementById('new-acc-code').value.trim();
        const name = document.getElementById('new-acc-name').value.trim();
        const type = document.getElementById('new-acc-type').value;
        const parentId = document.getElementById('new-acc-parent').value;
        const scope = getSelectedBranchId('accounts-branch-filter');
        const scopedBranchId = scope && scope !== 'all' ? scope : null;

        if (!code || !name) {
            alert('Vui lòng nhập mã và tên tài khoản!');
            return;
        }

        if (parentId) {
            const scopeBranchForChild = scopedBranchId;
            if (isAccountCodeTaken(code, scopeBranchForChild)) {
                alert('Mã tài khoản đã tồn tại!');
                return;
            }
        } else {
            if (isAccountCodeTaken(code, null)) {
                alert('Mã tài khoản đã tồn tại!');
                return;
            }
        }

        const newAccountId = `id_${code}`;

        if (parentId) {
            if (scopedBranchId) {
                createBranchIsolatedSubAccount(parentId, code, name, scopedBranchId);
            } else {
                createNewSubAccount(parentId, code, name);
            }
        } else {
            // Create parent account
            accounts[newAccountId] = {
                id: newAccountId,
                code: code,
                name: name,
                type: type,
                balance: 0,
                parentId: null,
                isParent: false,
                children: [],
                defaultChildId: null,
                branchId: null
            };
        }

        // Reset form
        document.getElementById('form-add-account').reset();
        document.getElementById('parent-warning').classList.add('hidden');

        // Re-render
        renderAll();
    }

    function onParentSelect() {
        const parentId = document.getElementById('new-acc-parent').value;
        const warning = document.getElementById('parent-warning');
        const scope = getSelectedBranchId('accounts-branch-filter');
        const scopedBranchId = scope && scope !== 'all' ? scope : null;
        if (parentId) {
            const parentAccount = accounts[parentId];
            const hasActivity = scopedBranchId
                ? getAccountBalanceByBranch(parentId, scopedBranchId) > 0 || hasAccountJournalActivityInBranch(parentId, scopedBranchId)
                : Math.abs(parentAccount.balance) > 0 || hasAccountJournalActivity(parentId);
            if (hasActivity && parentAccount.children.length === 0) {
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }
        } else {
            warning.classList.add('hidden');
        }
    }

    // ==========================================
    // IMPORT/EXPORT PRODUCTS
    // ==========================================
    function addImportProduct() {
        const container = document.getElementById('import-products');
        const materialProducts = products.filter(p => p.productType !== 'MON_AN');
        const productHtml = `
            <div class="bg-slate-800/50 p-4 rounded-lg grid grid-cols-12 gap-4 items-end product-row">
                <div class="col-span-5">
                    <label class="block text-sm mb-2">Sản phẩm</label>
                    <select class="product-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" onchange="calculateImportTotals()">
                        ${materialProducts.map(p => `<option value="${p.id}">${p.id} - ${p.name} (Tồn: ${p.quantity})</option>`).join('')}
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Số lượng</label>
                    <input type="number" class="product-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" value="1" min="0" step="0.001" onchange="calculateImportTotals()">
                </div>
                <div class="col-span-3">
                    <label class="block text-sm mb-2">Đơn giá (chưa VAT)</label>
                    <input type="number" class="product-price w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" value="0" min="0" onchange="calculateImportTotals()">
                </div>
                <div class="col-span-1">
                    <button type="button" onclick="removeProductRow(this)" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2.5 rounded-lg transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productHtml);
        calculateImportTotals();
    }

    function addExportProduct() {
        const container = document.getElementById('export-products');
        const materialProducts = products.filter(p => p.productType !== 'MON_AN');
        const productHtml = `
            <div class="bg-slate-800/50 p-4 rounded-lg grid grid-cols-12 gap-4 items-end product-row">
                <div class="col-span-4">
                    <label class="block text-sm mb-2">Sản phẩm</label>
                    <select class="product-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500" onchange="calculateExportTotals()">
                        ${materialProducts.map(p => `<option value="${p.id}">${p.id} - ${p.name} (Tồn: ${p.quantity})</option>`).join('')}
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Số lượng</label>
                    <input type="number" class="product-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500" value="1" min="0" step="0.001" onchange="calculateExportTotals()">
                </div>
                <div class="col-span-3">
                    <label class="block text-sm mb-2">Đơn giá bán (chưa VAT)</label>
                    <input type="number" class="product-price w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500" value="0" min="0" onchange="calculateExportTotals()">
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Đơn giá vốn</label>
                    <input type="number" class="product-cost w-full bg-slate-700 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none text-slate-400" value="0" readonly>
                </div>
                <div class="col-span-1">
                    <button type="button" onclick="removeProductRow(this)" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2.5 rounded-lg transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productHtml);
        calculateExportTotals();
    }

    function removeProductRow(btn) {
        btn.closest('.product-row').remove();
        if (document.getElementById('import-products')) calculateImportTotals();
        if (document.getElementById('export-products')) calculateExportTotals();
    }

    function calculateImportTotals() {
        const container = document.getElementById('import-products');
        if (!container) return;
        const rows = container.querySelectorAll('.product-row');
        const vatRate = parseFloat(document.getElementById('import-vat').value) / 100;
        
        let subtotal = 0;
        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            subtotal += qty * price;
        });
        
        const vatAmount = subtotal * vatRate;
        const total = subtotal + vatAmount;
        
        document.getElementById('import-subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('import-vat-amount').textContent = formatCurrency(vatAmount);
        document.getElementById('import-total').textContent = formatCurrency(total);
        
        updateImportPreview();
    }

    function calculateExportTotals() {
        const container = document.getElementById('export-products');
        if (!container) return;
        const rows = container.querySelectorAll('.product-row');
        const vatRate = parseFloat(document.getElementById('export-vat').value) / 100;
        const branchId = document.getElementById('export-branch')?.value || getDefaultBranchId();
        
        let subtotal = 0;
        let cogs = 0;
        
        rows.forEach(row => {
            const select = row.querySelector('.product-select');
            const productId = select.value;
            const product = products.find(p => p.id === productId);
            const stock = getBranchProductStock(branchId, productId);
            
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            
            if (product) {
                row.querySelector('.product-cost').value = stock.avgCost;
                cogs += qty * stock.avgCost;
            }
            
            subtotal += qty * price;
        });
        
        const vatAmount = subtotal * vatRate;
        const total = subtotal + vatAmount;
        
        document.getElementById('export-subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('export-vat-amount').textContent = formatCurrency(vatAmount);
        document.getElementById('export-total').textContent = formatCurrency(total);
        document.getElementById('export-cogs').textContent = formatCurrency(cogs);
        
        updateExportPreview();
    }

    // ==========================================
    // TRANSACTION PROCESSING
    // ==========================================
    function addTransaction(date, type, ref, desc, debitAccountId, creditAccountId, amount, branchId = getDefaultBranchId(), meta = null) {
        const periodKey = getPeriodKeyFromDate(date);
        const effectiveLock = getEffectiveLockedPeriodData(branchId, periodKey);
        const txn = {
            id: `txn_${transactionIdCounter++}`,
            date, type, ref, desc,
            debitAccountId, creditAccountId,
            amount,
            branchId,
            isLocked: !!effectiveLock.isLocked
        };
        if (meta && typeof meta === 'object') {
            Object.assign(txn, meta);
        }
        transactions.push(txn);

        // Update balances
        const debitAccount = accounts[debitAccountId];
        const creditAccount = accounts[creditAccountId];
        
        // For parent accounts, use default child if exists
        const debitAcc = getDisplayAccount(debitAccountId) || debitAccount;
        const creditAcc = getDisplayAccount(creditAccountId) || creditAccount;
        
        if (debitAcc) debitAcc.balance += amount;
        if (creditAcc) creditAcc.balance -= amount;
    }

    function saveImportVoucher(e) {
        e.preventDefault();
        
        const date = document.getElementById('import-date').value || getToday();
        const branchId = document.getElementById('import-branch')?.value || getDefaultBranchId();
        const partnerId = document.getElementById('import-partner').value;
        const partner = getPartnerById(partnerId);
        const paymentMethod = document.getElementById('import-payment').value;
        const vatRate = parseFloat(document.getElementById('import-vat').value) / 100;
        const ref = `PNK${String(importCounter++).padStart(3, '0')}`;
        const customDiv = document.getElementById('import-custom-accounts');
        
        // Get accounts
        let invDebitId, vatDebitId, payCreditId;
        if (customDiv && customDiv.classList.contains('hidden')) {
            invDebitId = 'id_156';
            vatDebitId = 'id_133';
            payCreditId = paymentMethod === 'cash' ? 'id_111' : 'id_331';
        } else {
            invDebitId = document.getElementById('import-debit-inventory')?.value;
            vatDebitId = document.getElementById('import-debit-vat')?.value;
            payCreditId = document.getElementById('import-credit-pay')?.value;
        }
        
        const container = document.getElementById('import-products');
        const rows = container.querySelectorAll('.product-row');
        
        if (rows.length === 0) {
            alert('Vui lòng thêm ít nhất một mặt hàng!');
            return;
        }
        
        let totalInventory = 0;
        let totalVAT = 0;
        
        // Process each product
        rows.forEach(row => {
            const productId = row.querySelector('.product-select').value;
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const lineTotal = qty * price;
            const lineVAT = lineTotal * vatRate;
            
            totalInventory += lineTotal;
            totalVAT += lineVAT;
            
            const stock = getBranchProductStock(branchId, productId);
            const oldTotal = stock.totalValue;
            const oldQty = stock.quantity;
            const newTotal = oldTotal + lineTotal;
            const newQty = oldQty + qty;

            stock.quantity = newQty;
            stock.totalValue = newTotal;
            stock.avgCost = newQty > 0 ? newTotal / newQty : 0;
            
            // Add journal entry for inventory
            addTransaction(date, 'import', ref, `Nhập ${product.name}: ${qty} x ${formatCurrency(price)}${partner ? ` từ ${partner.name}` : ''}`, invDebitId, payCreditId, lineTotal, branchId);
        });
        
        // Add journal entry for VAT
        if (totalVAT > 0 && vatDebitId) {
            addTransaction(date, 'import', ref, `VAT nhập kho ${ref}`, vatDebitId, payCreditId, totalVAT, branchId);
        }
        
        syncGlobalProductsFromBranchStocks();
        updateInventoryAccount();
        
        // Reset form
        document.getElementById('form-import').reset();
        document.getElementById('import-date').value = getToday();
        document.getElementById('import-products').innerHTML = '';
        document.getElementById('import-custom-accounts').classList.add('hidden');
        populateAccountSelects();
        calculateImportTotals();
        
        alert('Lưu phiếu nhập kho thành công!');
        renderAll();
    }

    function saveExportVoucher(e) {
        e.preventDefault();
        
        const date = document.getElementById('export-date').value || getToday();
        const branchId = document.getElementById('export-branch')?.value || getDefaultBranchId();
        const partnerId = document.getElementById('export-partner').value;
        const partner = getPartnerById(partnerId);
        const paymentMethod = document.getElementById('export-payment').value;
        const vatRate = parseFloat(document.getElementById('export-vat').value) / 100;
        const ref = `PXK${String(exportCounter++).padStart(3, '0')}`;
        const customDiv = document.getElementById('export-custom-accounts');
        
        // Get accounts
        let cogsDebitId, invCreditId, payDebitId, revCreditId, vatCreditId;
        if (customDiv && customDiv.classList.contains('hidden')) {
            cogsDebitId = 'id_632';
            invCreditId = 'id_156';
            payDebitId = paymentMethod === 'cash' ? 'id_111' : 'id_131';
            revCreditId = 'id_511';
            vatCreditId = 'id_3331';
        } else {
            cogsDebitId = document.getElementById('export-debit-cogs')?.value;
            invCreditId = document.getElementById('export-credit-inventory')?.value;
            payDebitId = document.getElementById('export-debit-pay')?.value;
            revCreditId = document.getElementById('export-credit-revenue')?.value;
            vatCreditId = document.getElementById('export-credit-vat')?.value;
        }
        
        const container = document.getElementById('export-products');
        const rows = container.querySelectorAll('.product-row');
        
        if (rows.length === 0) {
            alert('Vui lòng thêm ít nhất một mặt hàng!');
            return;
        }
        
        // Check stock first
        for (let row of rows) {
            const productId = row.querySelector('.product-select').value;
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const product = products.find(p => p.id === productId);
            const stock = getBranchProductStock(branchId, productId);
            
            if (!product) continue;
            if (qty > stock.quantity) {
                alert(`Số lượng ${product.name} không đủ! (Tồn chi nhánh: ${stock.quantity})`);
                return;
            }
        }
        
        let totalRevenue = 0;
        let totalCOGS = 0;
        let totalVAT = 0;
        let totalReceivable = 0;
        
        // Process each product
        rows.forEach(row => {
            const productId = row.querySelector('.product-select').value;
            const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            
            const product = products.find(p => p.id === productId);
            if (!product) return;
            const stock = getBranchProductStock(branchId, productId);
            
            const lineRevenue = qty * price;
            const lineCOGS = qty * stock.avgCost;
            const lineVAT = lineRevenue * vatRate;
            
            totalRevenue += lineRevenue;
            totalCOGS += lineCOGS;
            totalVAT += lineVAT;
            totalReceivable += (lineRevenue + lineVAT);
            
            stock.quantity -= qty;
            if (stock.quantity < 0) stock.quantity = 0;
            stock.totalValue = stock.quantity * stock.avgCost;
            if (stock.quantity === 0) stock.avgCost = 0;
            
            // Add COGS entry
            if (cogsDebitId && invCreditId) {
                addTransaction(date, 'export', ref, `Xuất ${product.name}: ${qty} sp (Giá vốn)`, cogsDebitId, invCreditId, lineCOGS, branchId, {
                    productId,
                    exportLineType: 'cogs',
                    qty,
                    unitCost: stock.avgCost,
                    partnerId: partnerId || null,
                    partnerName: partner?.name || null,
                    paymentMethod
                });
            }
            
            // Add revenue entry
            if (revCreditId) {
                addTransaction(date, 'export', ref, `Doanh thu bán ${product.name}: ${qty} x ${formatCurrency(price)}${partner ? ` cho ${partner.name}` : ''}`, 'id_000', revCreditId, lineRevenue, branchId, {
                    productId,
                    exportLineType: 'revenue',
                    qty,
                    unitPrice: price,
                    partnerId: partnerId || null,
                    partnerName: partner?.name || null,
                    paymentMethod
                });
            }
        });
        
        if (totalVAT > 0 && vatCreditId) {
            addTransaction(date, 'export', ref, `VAT bán ra ${ref}`, 'id_000', vatCreditId, totalVAT, branchId, {
                exportLineType: 'vat',
                vatRate,
                partnerId: partnerId || null,
                partnerName: partner?.name || null,
                paymentMethod
            });
        }

        if (totalReceivable > 0 && payDebitId) {
            addTransaction(date, 'export', ref, `Thu tiền/ghi nhận phải thu ${ref}${partner ? ` (${partner.name})` : ''}`, payDebitId, 'id_000', totalReceivable, branchId, {
                exportLineType: 'payment',
                vatRate,
                partnerId: partnerId || null,
                partnerName: partner?.name || null,
                paymentMethod
            });
        }
        
        syncGlobalProductsFromBranchStocks();
        updateInventoryAccount();
        
        // Reset form
        document.getElementById('form-export').reset();
        document.getElementById('export-date').value = getToday();
        document.getElementById('export-products').innerHTML = '';
        document.getElementById('export-custom-accounts').classList.add('hidden');
        populateAccountSelects();
        calculateExportTotals();
        
        alert('Lưu phiếu xuất kho thành công!');
        renderAll();
    }

    function addFnbOrderItem() {
        const container = document.getElementById('fnb-items');
        if (!container) return;
        const dishes = products.filter(p => p.productType === 'MON_AN');
        const rowHtml = `
            <div class="bg-slate-800/50 p-4 rounded-lg grid grid-cols-12 gap-4 items-end fnb-item-row">
                <div class="col-span-6">
                    <label class="block text-sm mb-2">Món</label>
                    <select class="fnb-dish-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-rose-500" onchange="calculateFnbOrderTotals()">
                        ${dishes.map(p => `<option value="${p.id}">${p.id} - ${p.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Số lượng</label>
                    <input type="number" class="fnb-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-rose-500" value="1" min="0" step="0.001" onchange="calculateFnbOrderTotals()">
                </div>
                <div class="col-span-3">
                    <label class="block text-sm mb-2">Đơn giá (chưa VAT)</label>
                    <input type="number" class="fnb-price w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-rose-500" value="0" min="0" onchange="calculateFnbOrderTotals()">
                </div>
                <div class="col-span-1">
                    <button type="button" onclick="removeFnbOrderItemRow(this)" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2.5 rounded-lg transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="col-span-12">
                    <div class="fnb-recipe bg-slate-900/30 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHtml);
        calculateFnbOrderTotals();
    }

    function removeFnbOrderItemRow(btn) {
        btn.closest('.fnb-item-row')?.remove();
        calculateFnbOrderTotals();
    }

    function formatQty(qty) {
        const s = Number(qty || 0).toFixed(3);
        return s.replace(/\.?0+$/, '');
    }

    function calculateFnbOrderTotals() {
        const container = document.getElementById('fnb-items');
        if (!container) return;
        const rows = container.querySelectorAll('.fnb-item-row');
        const branchId = document.getElementById('fnb-branch')?.value || getDefaultBranchId();
        let revenue = 0;

        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.fnb-qty')?.value) || 0;
            const price = parseFloat(row.querySelector('.fnb-price')?.value) || 0;
            revenue += qty * price;
            updateFnbRecipeForRow(row, branchId);
        });

        const vatRate = (parseFloat(document.getElementById('fnb-vat')?.value) || 0) / 100;
        const vat = revenue * vatRate;
        const total = revenue + vat;

        const revEl = document.getElementById('fnb-total-revenue');
        const vatEl = document.getElementById('fnb-total-vat');
        const payEl = document.getElementById('fnb-total-pay');
        if (revEl) revEl.textContent = formatCurrency(revenue);
        if (vatEl) vatEl.textContent = formatCurrency(vat);
        if (payEl) payEl.textContent = formatCurrency(total);
    }

    function updateFnbRecipeForRow(row, branchId) {
        const recipeEl = row.querySelector('.fnb-recipe');
        if (!recipeEl) return;

        const dishId = row.querySelector('.fnb-dish-select')?.value;
        const qty = parseFloat(row.querySelector('.fnb-qty')?.value) || 0;
        const dish = products.find(p => p.id === dishId);
        if (!dish || dish.productType !== 'MON_AN') {
            recipeEl.textContent = '';
            return;
        }

        const recipe = Array.isArray(dish.recipe) ? dish.recipe : [];
        if (recipe.length === 0) {
            recipeEl.innerHTML = `<div class="text-amber-300">Món này chưa có công thức (recipe) nên không thể tính trừ kho nguyên liệu.</div>`;
            return;
        }

        const lines = recipe.map(item => {
            const materialId = item.materialId;
            const requiredPerUnit = parseFloat(item.quantityRequired) || 0;
            const requiredQty = qty * requiredPerUnit;
            const material = products.find(p => p.id === materialId);
            const stock = getBranchProductStock(branchId, materialId);
            const enough = (stock.quantity || 0) + 1e-9 >= requiredQty;
            const unitCost = stock.avgCost || 0;
            const cost = requiredQty * unitCost;
            const name = material ? material.name : materialId;
            return `
                <div class="flex items-center justify-between gap-3 ${enough ? 'text-slate-300' : 'text-red-300'}">
                    <div class="truncate">
                        <span class="font-mono text-slate-400">${materialId}</span>
                        <span class="text-slate-200"> - ${name}</span>
                    </div>
                    <div class="font-mono whitespace-nowrap">
                        ${formatQty(requiredPerUnit)} x ${formatQty(qty)} = <span class="text-slate-100">${formatQty(requiredQty)}</span>
                        <span class="text-slate-500">|</span>
                        Tồn: ${formatQty(stock.quantity || 0)}
                        <span class="text-slate-500">|</span>
                        Ước GV: ${formatCurrency(cost)}
                    </div>
                </div>
            `;
        }).join('');

        recipeEl.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-slate-200">Công thức (recipe)</div>
                <div class="text-slate-500">Chi nhánh: <span class="font-mono">${branchId}</span></div>
            </div>
            <div class="space-y-1">${lines}</div>
        `;
    }

    function saveFnbOrder(e) {
        e.preventDefault();

        const date = document.getElementById('fnb-date')?.value || getToday();
        const branchId = document.getElementById('fnb-branch')?.value || getDefaultBranchId();
        const partnerId = document.getElementById('fnb-partner')?.value || '';
        const partner = getPartnerById(partnerId);
        const paymentMethod = document.getElementById('fnb-payment')?.value || 'cash';
        const vatRate = (parseFloat(document.getElementById('fnb-vat')?.value) || 0) / 100;

        const container = document.getElementById('fnb-items');
        const rows = container?.querySelectorAll('.fnb-item-row') || [];
        if (rows.length === 0) {
            alert('Vui lòng thêm ít nhất một món!');
            return;
        }

        const requirements = new Map();
        for (let row of rows) {
            const dishId = row.querySelector('.fnb-dish-select')?.value;
            const qty = parseFloat(row.querySelector('.fnb-qty')?.value) || 0;
            const dish = products.find(p => p.id === dishId);
            if (!dish || dish.productType !== 'MON_AN') continue;

            const recipe = Array.isArray(dish.recipe) ? dish.recipe : [];
            if (recipe.length === 0) {
                alert(`Món "${dish.name}" chưa có công thức (recipe), không thể bán.`);
                return;
            }

            recipe.forEach(item => {
                const materialId = item.materialId;
                const required = qty * (parseFloat(item.quantityRequired) || 0);
                if (!materialId || required <= 0) return;
                requirements.set(materialId, (requirements.get(materialId) || 0) + required);
            });
        }

        for (let [materialId, requiredQty] of requirements.entries()) {
            const material = products.find(p => p.id === materialId);
            const stock = getBranchProductStock(branchId, materialId);
            if ((stock.quantity || 0) + 1e-9 < requiredQty) {
                alert(`Không thể làm món này do kho đã thiếu "${material ? material.name : materialId}". Cần: ${formatQty(requiredQty)} | Tồn: ${formatQty(stock.quantity || 0)}`);
                return;
            }
        }

        const ref = `DHF${String(fnbOrderCounter++).padStart(3, '0')}`;
        const payDebitId = paymentMethod === 'cash' ? 'id_111' : paymentMethod === 'bank' ? 'id_112' : 'id_131';
        const revCreditId = document.getElementById('fnb-credit-revenue')?.value || 'id_511';
        const vatCreditId = document.getElementById('fnb-credit-vat')?.value || 'id_3331';
        const cogsDebitId = document.getElementById('fnb-debit-cogs')?.value || 'id_632';
        const materialCreditId = document.getElementById('fnb-credit-material')?.value || 'id_156';

        let totalRevenue = 0;

        rows.forEach(row => {
            const dishId = row.querySelector('.fnb-dish-select')?.value;
            const qty = parseFloat(row.querySelector('.fnb-qty')?.value) || 0;
            const price = parseFloat(row.querySelector('.fnb-price')?.value) || 0;
            const dish = products.find(p => p.id === dishId);
            if (!dish || dish.productType !== 'MON_AN' || qty <= 0) return;

            const lineRevenue = qty * price;
            totalRevenue += lineRevenue;

            addTransaction(date, 'fnb', ref, `Doanh thu bán ${dish.name}: ${formatQty(qty)} x ${formatCurrency(price)}${partner ? ` (${partner.name})` : ''}`, 'id_000', revCreditId, lineRevenue, branchId, {
                productId: dishId,
                exportLineType: 'revenue',
                qty,
                unitPrice: price,
                partnerId: partnerId || null,
                partnerName: partner?.name || null,
                paymentMethod
            });

            const recipe = Array.isArray(dish.recipe) ? dish.recipe : [];
            recipe.forEach(item => {
                const materialId = item.materialId;
                const requiredQty = qty * (parseFloat(item.quantityRequired) || 0);
                if (!materialId || requiredQty <= 0) return;

                const material = products.find(p => p.id === materialId);
                const stock = getBranchProductStock(branchId, materialId);
                const unitCost = stock.avgCost || 0;
                const cost = requiredQty * unitCost;

                stock.quantity = (stock.quantity || 0) - requiredQty;
                if (stock.quantity < 0) stock.quantity = 0;
                stock.totalValue = stock.quantity * (stock.avgCost || 0);
                if (stock.quantity === 0) {
                    stock.avgCost = 0;
                    stock.totalValue = 0;
                }

                addTransaction(date, 'fnb', ref, `Giá vốn ${dish.name} - NVL ${material ? material.name : materialId}: ${formatQty(requiredQty)}`, cogsDebitId, materialCreditId, cost, branchId, {
                    productId: materialId,
                    exportLineType: 'cogs',
                    qty: requiredQty,
                    unitCost,
                    fnbDishId: dishId,
                    fnbDishName: dish.name,
                    partnerId: partnerId || null,
                    partnerName: partner?.name || null,
                    paymentMethod
                });
            });
        });

        const totalVAT = totalRevenue * vatRate;
        if (totalVAT > 0) {
            addTransaction(date, 'fnb', ref, `VAT bán ra ${ref}`, 'id_000', vatCreditId, totalVAT, branchId, {
                exportLineType: 'vat',
                vatRate,
                partnerId: partnerId || null,
                partnerName: partner?.name || null,
                paymentMethod
            });
        }

        const totalPay = totalRevenue + totalVAT;
        if (totalPay > 0) {
            addTransaction(date, 'fnb', ref, `Thu tiền/ghi nhận phải thu ${ref}${partner ? ` (${partner.name})` : ''}`, payDebitId, 'id_000', totalPay, branchId, {
                exportLineType: 'payment',
                vatRate,
                partnerId: partnerId || null,
                partnerName: partner?.name || null,
                paymentMethod
            });
        }

        syncGlobalProductsFromBranchStocks();
        updateInventoryAccount();

        document.getElementById('form-fnb-order')?.reset();
        const dateEl = document.getElementById('fnb-date');
        if (dateEl) dateEl.value = getToday();
        if (container) container.innerHTML = '';
        addFnbOrderItem();

        alert('Lưu đơn hàng FnB thành công!');
        renderAll();
    }

    function saveReceiveVoucher(e) {
        e.preventDefault();
        const date = document.getElementById('recv-date').value || getToday();
        const branchId = document.getElementById('recv-branch')?.value || getDefaultBranchId();
        const partnerId = document.getElementById('recv-partner').value;
        const partner = getPartnerById(partnerId);
        const loaiId = document.getElementById('recv-loai-thu').value;
        const loai = loaiThuList.find(l => l.id === loaiId);
        const customDiv = document.getElementById('recv-custom-accounts');
        let debitId, creditId;
        
        if (customDiv && customDiv.classList.contains('hidden')) {
            // Use default accounts
            debitId = document.getElementById('recv-phuong-thuc-tt').value;
            creditId = loai ? loai.tai_khoan_co_mac_dinh : null;
        } else {
            // Use custom accounts
            debitId = document.getElementById('recv-debit').value;
            creditId = document.getElementById('recv-credit').value;
        }
        
        const amount = parseFloat(document.getElementById('recv-amount').value) || 0;
        if (!amount || !creditId || !debitId) return;
        
        addTransaction(date, 'receive', `PT${String(transactionIdCounter).padStart(3, '0')}`, `Thu tiền${partner ? ` từ ${partner.name}` : ''} (${loai?.ten_loai || 'Tùy chỉnh'})`, debitId, creditId, amount, branchId);
        
        document.getElementById('form-receive').reset();
        document.getElementById('recv-date').value = getToday();
        renderAll();
    }

    function savePayVoucher(e) {
        e.preventDefault();
        const date = document.getElementById('pay-date').value || getToday();
        const branchId = document.getElementById('pay-branch')?.value || getDefaultBranchId();
        const partnerId = document.getElementById('pay-partner').value;
        const partner = getPartnerById(partnerId);
        const loaiId = document.getElementById('pay-loai-chi').value;
        const loai = loaiChiList.find(l => l.id === loaiId);
        const customDiv = document.getElementById('pay-custom-accounts');
        let debitId, creditId;
        
        if (customDiv && customDiv.classList.contains('hidden')) {
            // Use default accounts
            debitId = loai ? loai.tai_khoan_no_mac_dinh : null;
            creditId = document.getElementById('pay-phuong-thuc-tt').value;
        } else {
            // Use custom accounts
            debitId = document.getElementById('pay-debit').value;
            creditId = document.getElementById('pay-credit').value;
        }
        
        const desc = document.getElementById('pay-desc').value;
        const amount = parseFloat(document.getElementById('pay-amount').value) || 0;
        if (!amount || !debitId || !creditId) return;
        
        addTransaction(date, 'pay', `PC${String(transactionIdCounter).padStart(3, '0')}`, desc || `Chi tiền${partner ? ` cho ${partner.name}` : ''} (${loai?.ten_loai || 'Tùy chỉnh'})`, debitId, creditId, amount, branchId);
        
        document.getElementById('form-pay').reset();
        document.getElementById('pay-date').value = getToday();
        renderAll();
    }

    function isInterBranchTransferTransaction(txn) {
        return txn?.type === 'interbranch';
    }

    function populateInterBranchTransferProductSelects() {
        const container = document.getElementById('ibt-products');
        if (!container) return;
        const fromBranchId = document.getElementById('ibt-from-branch')?.value || getDefaultBranchId();
        container.querySelectorAll('.ibt-product-select').forEach(select => {
            const currentValue = select.value;
            select.innerHTML = products.map(p => {
                const stock = getBranchProductStock(fromBranchId, p.id);
                return `<option value="${p.id}">${p.id} - ${p.name} (Tồn: ${stock.quantity})</option>`;
            }).join('');
            select.value = Array.from(select.options).some(option => option.value === currentValue)
                ? currentValue
                : (select.options[0]?.value || '');
        });
    }

    function calculateInterBranchTransferGoodsTotals() {
        const container = document.getElementById('ibt-products');
        const totalEl = document.getElementById('ibt-goods-total');
        if (!container) return;
        const fromBranchId = document.getElementById('ibt-from-branch')?.value || getDefaultBranchId();

        let total = 0;
        container.querySelectorAll('.ibt-product-row').forEach(row => {
            const productId = row.querySelector('.ibt-product-select')?.value;
            const qty = parseFloat(row.querySelector('.ibt-product-qty')?.value) || 0;
            const costInput = row.querySelector('.ibt-product-cost');
            const lineTotalEl = row.querySelector('.ibt-line-total');

            const stock = productId ? getBranchProductStock(fromBranchId, productId) : null;
            const unitCost = stock ? (stock.avgCost || 0) : 0;
            const lineTotal = qty * unitCost;

            if (costInput) costInput.value = Math.round(unitCost);
            if (lineTotalEl) lineTotalEl.textContent = formatCurrency(lineTotal);
            total += lineTotal;
        });

        if (totalEl) totalEl.textContent = formatCurrency(total);
    }

    function addInterBranchTransferProduct() {
        const container = document.getElementById('ibt-products');
        if (!container) return;

        const rowHtml = `
            <div class="bg-slate-800/50 p-4 rounded-lg grid grid-cols-12 gap-4 items-end ibt-product-row">
                <div class="col-span-5">
                    <label class="block text-sm mb-2">Sản phẩm</label>
                    <select class="ibt-product-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-fuchsia-500" onchange="calculateInterBranchTransferGoodsTotals()"></select>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Số lượng</label>
                    <input type="number" class="ibt-product-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-fuchsia-500" value="1" min="1" onchange="calculateInterBranchTransferGoodsTotals()">
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Giá vốn</label>
                    <input type="number" class="ibt-product-cost w-full bg-slate-700 border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none text-slate-400" value="0" readonly>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm mb-2">Thành tiền</label>
                    <div class="ibt-line-total w-full bg-slate-900/40 border border-slate-800 rounded-lg px-3 py-2.5 font-mono text-slate-200 text-right">0</div>
                </div>
                <div class="col-span-1">
                    <button type="button" onclick="removeInterBranchTransferProductRow(this)" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2.5 rounded-lg transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', rowHtml);
        populateInterBranchTransferProductSelects();
        calculateInterBranchTransferGoodsTotals();
    }

    function removeInterBranchTransferProductRow(btn) {
        btn.closest('.ibt-product-row')?.remove();
        calculateInterBranchTransferGoodsTotals();
    }

    function updateInterBranchTransferUI() {
        const type = document.getElementById('ibt-type')?.value || 'money';
        const moneyFields = document.getElementById('ibt-money-fields');
        const goodsFields = document.getElementById('ibt-goods-fields');
        if (moneyFields) moneyFields.classList.toggle('hidden', type !== 'money');
        if (goodsFields) goodsFields.classList.toggle('hidden', type !== 'goods');
        if (type === 'goods') {
            const container = document.getElementById('ibt-products');
            if (container && container.children.length === 0) {
                addInterBranchTransferProduct();
            } else {
                populateInterBranchTransferProductSelects();
                calculateInterBranchTransferGoodsTotals();
            }
        }
    }

    function saveInterBranchTransferVoucher(e) {
        e.preventDefault();
        const date = document.getElementById('ibt-date')?.value || getToday();
        const fromBranchId = document.getElementById('ibt-from-branch')?.value || getDefaultBranchId();
        const toBranchId = document.getElementById('ibt-to-branch')?.value || getDefaultBranchId();
        const type = document.getElementById('ibt-type')?.value || 'money';
        const note = (document.getElementById('ibt-note')?.value || '').trim();

        if (!fromBranchId || !toBranchId) {
            alert('Vui lòng chọn đầy đủ chi nhánh xuất và chi nhánh nhận!');
            return;
        }
        if (fromBranchId === toBranchId) {
            alert('Chi nhánh xuất và chi nhánh nhận phải khác nhau!');
            return;
        }

        const ref = `DCNB${String(interBranchTransferCounter++).padStart(3, '0')}`;

        const notePart = note ? ` - ${note}` : '';

        if (type === 'money') {
            const assetAccountId = document.getElementById('ibt-money-account')?.value || 'id_111';
            const amount = parseFloat(document.getElementById('ibt-amount')?.value) || 0;
            if (!amount || amount <= 0) {
                alert('Vui lòng nhập số tiền hợp lệ!');
                return;
            }
            const moneyAcc = accounts[assetAccountId];
            const descDetail = `Tiền (${moneyAcc ? `${moneyAcc.code} - ${moneyAcc.name}` : assetAccountId})`;

            addTransaction(
                date,
                'interbranch',
                ref,
                `Điều chuyển nội bộ xuất ${descDetail}${notePart}`,
                'id_136',
                assetAccountId,
                amount,
                fromBranchId
            );

            addTransaction(
                date,
                'interbranch',
                ref,
                `Điều chuyển nội bộ nhận ${descDetail}${notePart}`,
                assetAccountId,
                'id_336',
                amount,
                toBranchId
            );
        } else {
            const container = document.getElementById('ibt-products');
            const rows = container ? Array.from(container.querySelectorAll('.ibt-product-row')) : [];
            if (rows.length === 0) {
                alert('Vui lòng thêm ít nhất một mặt hàng!');
                return;
            }

            for (const row of rows) {
                const productId = row.querySelector('.ibt-product-select')?.value;
                const qty = parseFloat(row.querySelector('.ibt-product-qty')?.value) || 0;
                if (!productId) {
                    alert('Vui lòng chọn sản phẩm!');
                    return;
                }
                if (!qty || qty <= 0) {
                    alert('Vui lòng nhập số lượng hợp lệ!');
                    return;
                }

                const product = products.find(p => p.id === productId);
                const fromStock = getBranchProductStock(fromBranchId, productId);
                if (qty > fromStock.quantity) {
                    alert(`Tồn kho chi nhánh xuất không đủ cho ${product ? product.name : productId}! (Tồn: ${fromStock.quantity})`);
                    return;
                }
            }

            rows.forEach(row => {
                const productId = row.querySelector('.ibt-product-select')?.value;
                const qty = parseFloat(row.querySelector('.ibt-product-qty')?.value) || 0;
                const product = products.find(p => p.id === productId);

                const fromStock = getBranchProductStock(fromBranchId, productId);
                const unitCost = fromStock.avgCost || 0;
                const amount = qty * unitCost;

                fromStock.quantity -= qty;
                if (fromStock.quantity < 0) fromStock.quantity = 0;
                fromStock.totalValue = fromStock.quantity * (fromStock.avgCost || 0);
                if (fromStock.quantity === 0) {
                    fromStock.avgCost = 0;
                    fromStock.totalValue = 0;
                }

                const toStock = getBranchProductStock(toBranchId, productId);
                const oldQty = toStock.quantity;
                const oldTotal = toStock.totalValue;
                const newQty = oldQty + qty;
                const newTotal = oldTotal + amount;
                toStock.quantity = newQty;
                toStock.totalValue = newTotal;
                toStock.avgCost = newQty > 0 ? newTotal / newQty : 0;

                const descDetail = `Hàng (${product ? `${product.id} - ${product.name}` : productId}): ${qty} sp`;

                addTransaction(
                    date,
                    'interbranch',
                    ref,
                    `Điều chuyển nội bộ xuất ${descDetail}${notePart}`,
                    'id_136',
                    'id_156',
                    amount,
                    fromBranchId
                );

                addTransaction(
                    date,
                    'interbranch',
                    ref,
                    `Điều chuyển nội bộ nhận ${descDetail}${notePart}`,
                    'id_156',
                    'id_336',
                    amount,
                    toBranchId
                );
            });
        }

        syncGlobalProductsFromBranchStocks();
        updateInventoryAccount();

        document.getElementById('form-inter-branch-transfer')?.reset();
        const goodsContainer = document.getElementById('ibt-products');
        if (goodsContainer) goodsContainer.innerHTML = '';
        const dateInput = document.getElementById('ibt-date');
        if (dateInput) dateInput.value = getToday();
        populateBranchSelects();
        updateInterBranchTransferUI();
        renderAll();
        alert('Đã lưu phiếu điều chuyển nội bộ!');
    }

    function populateClosingSourceSelect() {
        const select = document.getElementById('closing-source-account');
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Chọn tài khoản nguồn --</option>';

        Object.values(accounts)
            .filter(account => account.code !== '000' && account.code !== '911')
            .sort((a, b) => a.code.localeCompare(b.code, 'vi'))
            .forEach(account => {
                const option = document.createElement('option');
                option.value = account.code;
                option.textContent = `${account.code} - ${account.name}`;
                select.appendChild(option);
            });

        select.value = currentValue;
    }

    function renderClosingRules() {
        const tbody = document.getElementById('closing-rules-table');
        if (!tbody) return;

        tbody.innerHTML = '';

        const scope = getSelectedBranchId('closing-config-branch-filter');
        const scopedBranchId = scope && scope !== 'all' ? scope : null;

        const rulesToRender = scopedBranchId ? getEffectiveClosingRules(scopedBranchId) : closingRules.filter(rule => (rule.branchId === undefined ? null : rule.branchId) === null);

        rulesToRender
            .forEach(rule => {
            const tr = document.createElement('tr');
            tr.className = 'border-t border-slate-700 hover:bg-slate-800/30';
            tr.innerHTML = `
                <td class="p-4 text-slate-200">${rule.ten_quy_tac}</td>
                <td class="p-4 text-slate-300 font-mono">${getAccountLabelByCode(rule.tai_khoan_nguon)}</td>
                <td class="p-4 text-slate-300 font-mono">${getAccountLabelByCode(rule.tai_khoan_dich)}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${rule.loai_ket_chuyen === 'doanh_thu' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-orange-900/40 text-orange-300'}">
                        ${rule.loai_ket_chuyen === 'doanh_thu' ? 'Doanh thu' : 'Chi phí'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function getEffectiveClosingRules(branchId) {
        const baseRules = closingRules.filter(rule => (rule.branchId === undefined ? null : rule.branchId) === null);
        const branchRules = closingRules.filter(rule => (rule.branchId === undefined ? null : rule.branchId) === branchId);
        const map = new Map();
        baseRules.forEach(rule => {
            map.set(`${rule.tai_khoan_nguon}|${rule.loai_ket_chuyen}`, rule);
        });
        branchRules.forEach(rule => {
            map.set(`${rule.tai_khoan_nguon}|${rule.loai_ket_chuyen}`, rule);
        });
        return Array.from(map.values());
    }

    function addClosingRule() {
        const sourceCode = document.getElementById('closing-source-account')?.value;
        const closingType = document.getElementById('closing-rule-type')?.value;
        const scope = getSelectedBranchId('closing-config-branch-filter');
        const scopedBranchId = scope && scope !== 'all' ? scope : null;

        if (!sourceCode || !closingType) {
            alert('Vui lòng chọn tài khoản nguồn và loại kết chuyển!');
            return;
        }

        const duplicateRule = closingRules.find(rule =>
            rule.tai_khoan_nguon === sourceCode &&
            rule.loai_ket_chuyen === closingType &&
            (rule.branchId === undefined ? null : rule.branchId) === scopedBranchId
        );
        if (duplicateRule) {
            alert('Quy tắc này đã tồn tại!');
            return;
        }

        const sourceAccount = getAccountByCode(sourceCode);
        const sourceLabel = sourceAccount ? sourceAccount.name : sourceCode;

        closingRules.push({
            id: `CR${String(closingRuleCounter++).padStart(3, '0')}`,
            ten_quy_tac: `Kết chuyển ${sourceLabel}`,
            tai_khoan_nguon: sourceCode,
            tai_khoan_dich: "911",
            loai_ket_chuyen: closingType,
            branchId: scopedBranchId
        });

        renderClosingRules();
        populateClosingSourceSelect();
        document.getElementById('closing-source-account').value = '';
        document.getElementById('closing-rule-type').value = 'doanh_thu';
    }

    function executeClosingForBranch(branchId, date) {
        let totalDepreciation = 0;
        let totalRevenue = 0;
        let totalExpenses = 0;
        let vatOffsetAmount = 0;
        let corporateIncomeTax = 0;

        const vatInputBalance = Math.max(getAccountBalanceByBranch('id_133', branchId), 0);
        const vatOutputBalance = Math.abs(Math.min(getAccountBalanceByBranch('id_3331', branchId), 0));
        vatOffsetAmount = Math.min(vatInputBalance, vatOutputBalance);

        if (vatOffsetAmount > 0) {
            addTransaction(
                date,
                'closing',
                `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                'Khấu trừ thuế GTGT cuối kỳ',
                'id_3331',
                'id_133',
                vatOffsetAmount,
                branchId
            );
        }

        fixedAssets
            .filter(asset => (asset.branchId || getDefaultBranchId()) === branchId)
            .forEach(asset => {
                if (asset.remainingMonths > 0) {
                    totalDepreciation += asset.depreciationPerMonth;
                    asset.remainingMonths--;
                    asset.remainingValue -= asset.depreciationPerMonth;
                    addTransaction(
                        date,
                        'depreciation',
                        `PKH${String(transactionIdCounter).padStart(3, '0')}`,
                        `Khấu hao ${asset.name} tháng ${new Date().getMonth() + 1}`,
                        'id_642',
                        'id_214',
                        asset.depreciationPerMonth,
                        branchId
                    );
                }
            });

        const effectiveClosingRules = getEffectiveClosingRules(branchId);
        effectiveClosingRules.forEach(rule => {
            const targetAccount = getAccountByCode(rule.tai_khoan_dich);
            if (!targetAccount) return;

            const sourceAccounts = getClosingSourceAccounts(rule.tai_khoan_nguon);
            sourceAccounts.forEach(sourceAccount => {
                const sourceBalance = getAccountBalanceByBranch(sourceAccount.id, branchId);
                if (rule.loai_ket_chuyen === 'doanh_thu') {
                    const amount = Math.abs(Math.min(sourceBalance, 0));
                    if (amount <= 0) return;
                    addTransaction(
                        date,
                        'closing',
                        `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                        `${rule.ten_quy_tac} (${sourceAccount.code})`,
                        sourceAccount.id,
                        targetAccount.id,
                        amount,
                        branchId
                    );
                    totalRevenue += amount;
                } else {
                    const amount = Math.max(sourceBalance, 0);
                    if (amount <= 0) return;
                    addTransaction(
                        date,
                        'closing',
                        `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                        `${rule.ten_quy_tac} (${sourceAccount.code})`,
                        targetAccount.id,
                        sourceAccount.id,
                        amount,
                        branchId
                    );
                    totalExpenses += amount;
                }
            });
        });

        const profitBeforeTax = -getAccountBalanceByBranch('id_911', branchId);
        if (profitBeforeTax > 0) {
            corporateIncomeTax = profitBeforeTax * 0.2;
            addTransaction(
                date,
                'closing',
                `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                'Tính thuế TNDN phải nộp',
                'id_821',
                'id_3334',
                corporateIncomeTax,
                branchId
            );
            addTransaction(
                date,
                'closing',
                `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                'Kết chuyển chi phí thuế TNDN',
                'id_911',
                'id_821',
                corporateIncomeTax,
                branchId
            );
            totalExpenses += corporateIncomeTax;
        }

        const incomeSummaryBalance = getAccountBalanceByBranch('id_911', branchId);
        const profit = -incomeSummaryBalance;
        if (incomeSummaryBalance < 0) {
            addTransaction(
                date,
                'closing',
                `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                'Kết chuyển lợi nhuận',
                'id_911',
                'id_421',
                Math.abs(incomeSummaryBalance),
                branchId
            );
        } else if (incomeSummaryBalance > 0) {
            addTransaction(
                date,
                'closing',
                `PCK${String(transactionIdCounter).padStart(3, '0')}`,
                'Kết chuyển lỗ',
                'id_421',
                'id_911',
                incomeSummaryBalance,
                branchId
            );
        }

        return {
            totalDepreciation,
            totalRevenue,
            totalExpenses,
            vatOffsetAmount,
            corporateIncomeTax,
            profit
        };
    }

    function executeClosing() {
        const date = getToday();
        const selectedBranchId = getSelectedBranchId('closing-branch-filter');
        const branchIds = selectedBranchId === 'all' ? branches.map(branch => branch.id) : [selectedBranchId || getDefaultBranchId()];

        let totalDepreciation = 0;
        let totalRevenue = 0;
        let totalExpenses = 0;
        let vatOffsetAmount = 0;
        let corporateIncomeTax = 0;
        let profit = 0;

        branchIds.forEach(branchId => {
            const result = executeClosingForBranch(branchId, date);
            totalDepreciation += result.totalDepreciation;
            totalRevenue += result.totalRevenue;
            totalExpenses += result.totalExpenses;
            vatOffsetAmount += result.vatOffsetAmount;
            corporateIncomeTax += result.corporateIncomeTax;
            profit += result.profit;
        });

        const closingKey = getPeriodKeyFromDate(date);
        branchIds.forEach(branchId => {
            const closingPeriod = getLockedPeriodDataByBranch(branchId, closingKey);
            closingPeriod.isClosed = true;
        });
        if (selectedBranchId === 'all') {
            const closingPeriod = getLockedPeriodDataByBranch('all', closingKey);
            closingPeriod.isClosed = true;
        }

        document.getElementById('closing-revenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('closing-expense').textContent = formatCurrency(totalExpenses);
        document.getElementById('closing-profit').textContent = formatCurrency(profit);
        document.getElementById('closing-profit').className = profit >= 0 ? 'text-2xl font-bold text-emerald-400' : 'text-2xl font-bold text-red-400';

        const messageDiv = document.getElementById('closing-message');
        const scopeLabel = selectedBranchId === 'all' ? 'Toàn công ty' : getBranchLabelById(branchIds[0]);
        if (profit >= 0) {
            messageDiv.className = 'p-4 rounded-lg bg-emerald-900/30 border border-emerald-700/50';
            messageDiv.innerHTML = `<p class="text-emerald-300 font-semibold">✓ ${scopeLabel}: lãi sau thuế ${formatCurrency(profit)}. Đã khấu trừ VAT ${formatCurrency(vatOffsetAmount)}, khấu hao ${formatCurrency(totalDepreciation)} và tính thuế TNDN ${formatCurrency(corporateIncomeTax)}.</p>`;
        } else {
            messageDiv.className = 'p-4 rounded-lg bg-red-900/30 border border-red-700/50';
            messageDiv.innerHTML = `<p class="text-red-300 font-semibold">⚠ ${scopeLabel}: lỗ ${formatCurrency(-profit)}. Đã khấu trừ VAT ${formatCurrency(vatOffsetAmount)}, khấu hao ${formatCurrency(totalDepreciation)} và không phát sinh thuế TNDN phải nộp.</p>`;
        }

        document.getElementById('closing-result').classList.remove('hidden');
        renderAll();
    }

    // ==========================================
    // RENDERING FUNCTIONS
    // ==========================================


    function renderAccountTree() {
        const container = document.getElementById('account-tree');
        if (!container) return;
        container.innerHTML = '';
        const branchId = getSelectedBranchId('accounts-branch-filter');
        
        // Find root accounts
        const rootAccounts = Object.values(accounts).filter(a => !a.parentId);
        
        rootAccounts.forEach(account => {
            if (!isAccountVisibleInBranch(account, branchId)) return;
            container.insertAdjacentHTML('beforeend', renderAccountNode(account, 0, branchId));
        });
    }

    function renderAccountNode(account, level, branchId = 'all') {
        const indent = level * 24;
        const visibleChildren = (account.children || []).filter(childId => {
            const child = accounts[childId];
            return child && isAccountVisibleInBranch(child, branchId);
        });
        const isParent = account.isParent && visibleChildren.length > 0;
        const balance = branchId === 'all' ? getAccountBalance(account.id) : getAccountBalanceByBranch(account.id, branchId);
        
        let colorClass = 'text-slate-300';
        if (account.type === 'Tài sản') colorClass = 'text-green-400';
        else if (account.type === 'Nợ phải trả') colorClass = 'text-orange-400';
        else if (account.type === 'Vốn chủ sở hữu') colorClass = 'text-blue-400';
        else if (account.type === 'Doanh thu') colorClass = 'text-emerald-400';
        else if (account.type === 'Chi phí') colorClass = 'text-red-400';
        
        let html = `
            <div class="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all">
                <div class="flex items-center justify-between" style="padding-left: ${indent}px">
                    <div class="flex items-center gap-2">
                        ${isParent ? `<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>` : `<span class="w-4"></span>`}
                        <span class="font-mono text-sm text-slate-400">${account.code}</span>
                        <span class="font-medium">${account.name}</span>
                        ${account.defaultChildId ? `<span class="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400">Tổng hợp</span>` : ''}
                    </div>
                    <span class="font-mono font-bold ${colorClass}">${formatCurrency(balance)}</span>
                </div>
            </div>
        `;
        
        if (isParent) {
            visibleChildren.forEach(childId => {
                html += renderAccountNode(accounts[childId], level + 1, branchId);
            });
        }
        
        return html;
    }

    function renderJournal() {
        const filter = document.getElementById('filter-type');
        const branchId = getSelectedBranchId('journal-branch-filter');
        const tbody = document.getElementById('journal-table');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let filteredTransactions = getTransactionsByBranch(branchId);
        if (filter && filter.value !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === filter.value);
        }

        const refFilterKey = `${appStorageKey}_journal_ref_filter_v1`;
        const refFilter = localStorage.getItem(refFilterKey);
        if (refFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.ref === refFilter);

            const controls = document.querySelector('#module-journal .flex.gap-3') || document.querySelector('#module-journal .flex.flex-wrap.gap-3');
            if (controls && !document.getElementById('journal-ref-filter-pill')) {
                const pill = document.createElement('button');
                pill.id = 'journal-ref-filter-pill';
                pill.type = 'button';
                pill.className = 'inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20';
                pill.innerHTML = `<span class="font-mono">${refFilter}</span><span class="text-emerald-300/80">✕</span>`;
                pill.addEventListener('click', () => {
                    localStorage.removeItem(refFilterKey);
                    pill.remove();
                    renderJournal();
                });
                controls.appendChild(pill);
            }
        } else {
            document.getElementById('journal-ref-filter-pill')?.remove();
        }
        
        filteredTransactions.forEach(txn => {
            const debitAcc = getDisplayAccount(txn.debitAccountId) || accounts[txn.debitAccountId];
            const creditAcc = getDisplayAccount(txn.creditAccountId) || accounts[txn.creditAccountId];
            
            let typeColor = 'text-slate-400';
            let typeLabel = txn.type;
            if (txn.type === 'receive') { typeColor = 'text-green-400'; typeLabel = 'Phiếu thu'; }
            if (txn.type === 'pay') { typeColor = 'text-red-400'; typeLabel = 'Phiếu chi'; }
            if (txn.type === 'import') { typeColor = 'text-blue-400'; typeLabel = 'Nhập kho'; }
            if (txn.type === 'export') { typeColor = 'text-orange-400'; typeLabel = 'Xuất kho'; }
            if (txn.type === 'fnb') { typeColor = 'text-rose-400'; typeLabel = 'Đơn FnB'; }
            if (txn.type === 'depreciation') { typeColor = 'text-yellow-400'; typeLabel = 'Khấu hao'; }
            if (txn.type === 'closing') { typeColor = 'text-cyan-400'; typeLabel = 'Kết chuyển'; }
            if (txn.type === 'internal') { typeColor = 'text-purple-400'; typeLabel = 'Điều chỉnh'; }
            if (txn.type === 'interbranch') { typeColor = 'text-fuchsia-400'; typeLabel = 'Điều chuyển'; }

            const productHint = txn.productId
                ? `<span class="ml-2 inline-flex items-center rounded bg-slate-700/60 px-2 py-0.5 text-xs font-mono text-slate-200">${txn.productId}</span>`
                : '';

            const branchHint = branchId === 'all'
                ? `<div class="mt-1 text-xs text-cyan-400">${getBranchLabelById(txn.branchId)}</div>`
                : '';
            
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 text-slate-300">${txn.date}</td>
                    <td class="p-4 font-mono text-slate-400">
                        <button type="button" class="font-mono text-slate-300 hover:text-cyan-300 underline underline-offset-2" onclick="openVoucherDetail('${txn.ref}')">${txn.ref}</button>
                    </td>
                    <td class="p-4 ${typeColor} font-medium">${typeLabel}</td>
                    <td class="p-4 text-slate-300">${txn.desc}${productHint}${branchHint}</td>
                    <td class="p-4 font-mono text-green-400">${debitAcc ? `${debitAcc.code} - ${debitAcc.name}` : ''}</td>
                    <td class="p-4 font-mono text-red-400">${creditAcc ? `${creditAcc.code} - ${creditAcc.name}` : ''}</td>
                    <td class="p-4 text-right font-mono text-slate-200">${formatCurrency(txn.amount)}</td>
                </tr>
            `);
        });
    }

    function openJournalForRef(ref) {
        const refFilterKey = `${appStorageKey}_journal_ref_filter_v1`;
        localStorage.setItem(refFilterKey, ref);
        showModule('journal');
    }

    function renderInvoices() {
        const tbody = document.getElementById('invoices-table');
        if (!tbody) return;

        const branchId = getSelectedBranchId('invoices-branch-filter');
        const txns = getTransactionsByBranch(branchId).filter(t => t.type === 'export' && typeof t.ref === 'string' && t.ref.startsWith('PXK'));
        const groups = new Map();
        txns.forEach(txn => {
            if (!groups.has(txn.ref)) groups.set(txn.ref, []);
            groups.get(txn.ref).push(txn);
        });

        const rows = Array.from(groups.entries()).map(([ref, list]) => {
            list.sort((a, b) => String(a.id).localeCompare(String(b.id)));
            const first = list[0];
            const branchLabel = getBranchLabelById(first.branchId);

            const revenueTxns = list.filter(t => t.exportLineType === 'revenue' || (accounts[t.creditAccountId]?.code || '').startsWith('511'));
            const vatTxns = list.filter(t => t.exportLineType === 'vat' || (accounts[t.creditAccountId]?.code || '') === '3331');
            const paymentTxn = list.find(t => t.exportLineType === 'payment') || list.find(t => (accounts[t.debitAccountId]?.code || '') === '111' || (accounts[t.debitAccountId]?.code || '') === '112' || (accounts[t.debitAccountId]?.code || '') === '131');

            const revenue = revenueTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
            const vat = vatTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
            const total = paymentTxn?.amount || (revenue + vat);

            const qtySum = revenueTxns.reduce((sum, t) => sum + (typeof t.qty === 'number' ? t.qty : 0), 0);
            const lineCount = revenueTxns.length;

            const partnerName = paymentTxn?.partnerName || revenueTxns.find(t => t.partnerName)?.partnerName || '';
            const paymentAcc = paymentTxn ? (getDisplayAccount(paymentTxn.debitAccountId) || accounts[paymentTxn.debitAccountId]) : null;

            return {
                ref,
                date: first.date,
                branchId: first.branchId,
                branchLabel,
                partnerName,
                lineCount,
                qtySum,
                revenue,
                vat,
                total,
                paymentLabel: paymentAcc ? `${paymentAcc.code}` : ''
            };
        });

        rows.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.ref).localeCompare(String(a.ref)));

        tbody.innerHTML = rows.map(inv => `
            <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                <td class="p-4 text-slate-200 font-mono">${inv.ref}</td>
                <td class="p-4 text-slate-300">${inv.date}</td>
                <td class="p-4 text-slate-300">${branchId === 'all' ? inv.branchLabel : ''}</td>
                <td class="p-4 text-slate-200">${inv.partnerName || ''}</td>
                <td class="p-4 text-right font-mono text-slate-200">${inv.qtySum > 0 ? inv.qtySum : inv.lineCount}</td>
                <td class="p-4 text-right font-mono text-slate-200">${formatCurrency(inv.revenue)}</td>
                <td class="p-4 text-right font-mono text-slate-200">${formatCurrency(inv.vat)}</td>
                <td class="p-4 text-right font-mono text-emerald-300">${formatCurrency(inv.total)}</td>
                <td class="p-4 text-center">
                    <button type="button" class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50" onclick="openJournalForRef('${inv.ref}')">
                        Xem nhật ký
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function getVoucherTypeMeta(type) {
        const meta = { label: type, colorClass: 'text-slate-400' };
        if (type === 'receive') return { label: 'Phiếu thu', colorClass: 'text-green-400' };
        if (type === 'pay') return { label: 'Phiếu chi', colorClass: 'text-red-400' };
        if (type === 'import') return { label: 'Nhập kho', colorClass: 'text-blue-400' };
        if (type === 'export') return { label: 'Xuất kho', colorClass: 'text-orange-400' };
        if (type === 'fnb') return { label: 'Đơn FnB', colorClass: 'text-rose-400' };
        if (type === 'interbranch') return { label: 'Điều chuyển', colorClass: 'text-fuchsia-400' };
        if (type === 'internal') return { label: 'Điều chỉnh', colorClass: 'text-purple-400' };
        if (type === 'closing') return { label: 'Kết chuyển', colorClass: 'text-cyan-400' };
        if (type === 'depreciation') return { label: 'Khấu hao', colorClass: 'text-yellow-400' };
        return meta;
    }

    function ensureVoucherDetailModal() {
        let modal = document.getElementById('voucher-detail-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'voucher-detail-modal';
        modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-4';
        modal.innerHTML = `
            <div class="glassmorphism w-full max-w-5xl rounded-2xl border border-slate-700">
                <div class="flex items-start justify-between gap-3 border-b border-slate-700 p-6">
                    <div>
                        <div class="text-sm text-slate-400" id="voucher-detail-subtitle"></div>
                        <div class="mt-1 text-2xl font-bold text-slate-100" id="voucher-detail-title"></div>
                    </div>
                    <button type="button" class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50" data-role="close-voucher-detail">
                        Đóng
                    </button>
                </div>
                <div class="p-6">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-800">
                                <tr>
                                    <th class="text-left p-3 font-semibold">Chi nhánh</th>
                                    <th class="text-left p-3 font-semibold">Diễn giải</th>
                                    <th class="text-left p-3 font-semibold">TK Nợ</th>
                                    <th class="text-left p-3 font-semibold">TK Có</th>
                                    <th class="text-right p-3 font-semibold">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody id="voucher-detail-lines"></tbody>
                        </table>
                    </div>
                    <div class="mt-5 flex flex-wrap items-center justify-end gap-3">
                        <button type="button" class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20" data-role="open-journal">
                            Xem trong Nhật ký
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
        modal.querySelector('[data-role="close-voucher-detail"]')?.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        return modal;
    }

    function openVoucherDetail(ref) {
        const modal = ensureVoucherDetailModal();
        const titleEl = modal.querySelector('#voucher-detail-title');
        const subtitleEl = modal.querySelector('#voucher-detail-subtitle');
        const tbody = modal.querySelector('#voucher-detail-lines');

        const list = transactions.filter(t => t.ref === ref);
        if (list.length === 0) return;

        list.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id)));
        const first = list[0];
        const meta = getVoucherTypeMeta(first.type);

        const branchIds = Array.from(new Set(list.map(t => t.branchId))).filter(Boolean);
        const branchLabel = branchIds.length === 1 ? getBranchLabelById(branchIds[0]) : (branchIds.length > 1 ? 'Nhiều chi nhánh' : '');

        if (subtitleEl) subtitleEl.textContent = `${meta.label}${branchLabel ? ` • ${branchLabel}` : ''} • ${first.date}`;
        if (titleEl) titleEl.textContent = ref;

        if (tbody) {
            tbody.innerHTML = list.map(txn => {
                const debitAcc = getDisplayAccount(txn.debitAccountId) || accounts[txn.debitAccountId];
                const creditAcc = getDisplayAccount(txn.creditAccountId) || accounts[txn.creditAccountId];
                const productHint = txn.productId
                    ? `<span class="ml-2 inline-flex items-center rounded bg-slate-700/60 px-2 py-0.5 text-xs font-mono text-slate-200">${txn.productId}</span>`
                    : '';
                return `
                    <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                        <td class="p-3 text-slate-300">${getBranchLabelById(txn.branchId)}</td>
                        <td class="p-3 text-slate-200">${txn.desc}${productHint}</td>
                        <td class="p-3 font-mono text-green-400">${debitAcc ? `${debitAcc.code} - ${debitAcc.name}` : ''}</td>
                        <td class="p-3 font-mono text-red-400">${creditAcc ? `${creditAcc.code} - ${creditAcc.name}` : ''}</td>
                        <td class="p-3 text-right font-mono text-slate-200">${formatCurrency(txn.amount)}</td>
                    </tr>
                `;
            }).join('');
        }

        modal.querySelector('[data-role="open-journal"]')?.addEventListener('click', () => openJournalForRef(ref), { once: true });

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function getVoucherTotalByType(type, list) {
        const maxAmount = list.reduce((m, t) => Math.max(m, t.amount || 0), 0);
        if (type === 'export' || type === 'fnb') {
            const paymentTxn = list.find(t => t.exportLineType === 'payment') || list.find(t => ['111', '112', '131'].includes(accounts[t.debitAccountId]?.code || ''));
            return paymentTxn?.amount || maxAmount;
        }
        if (type === 'receive' || type === 'pay') {
            return maxAmount;
        }
        if (type === 'import') {
            const payCredits = list.filter(t => ['111', '112', '331'].includes(accounts[t.creditAccountId]?.code || ''));
            const total = payCredits.reduce((sum, t) => sum + (t.amount || 0), 0);
            return total > 0 ? total : maxAmount;
        }
        if (type === 'interbranch') {
            const ar = list.filter(t => (accounts[t.debitAccountId]?.code || '') === '136');
            if (ar.length > 0) return ar.reduce((sum, t) => sum + (t.amount || 0), 0);
            const ap = list.filter(t => (accounts[t.creditAccountId]?.code || '') === '336');
            if (ap.length > 0) return ap.reduce((sum, t) => sum + (t.amount || 0), 0);
            return maxAmount;
        }
        return maxAmount;
    }

    function renderVouchers() {
        const tbody = document.getElementById('vouchers-table');
        if (!tbody) return;

        const branchId = getSelectedBranchId('vouchers-branch-filter');
        const typeFilter = document.getElementById('vouchers-type-filter')?.value || 'all';
        const keyword = (document.getElementById('vouchers-keyword')?.value || '').trim().toLowerCase();

        let txns = getTransactionsByBranch(branchId).filter(t => !!t.ref);
        if (typeFilter !== 'all') {
            txns = txns.filter(t => t.type === typeFilter);
        }

        const groups = new Map();
        txns.forEach(txn => {
            if (!groups.has(txn.ref)) groups.set(txn.ref, []);
            groups.get(txn.ref).push(txn);
        });

        const rows = Array.from(groups.entries()).map(([ref, list]) => {
            list.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id)));
            const first = list[0];
            const meta = getVoucherTypeMeta(first.type);
            const branchIds = Array.from(new Set(list.map(t => t.branchId))).filter(Boolean);
            const branchLabel = branchIds.length === 1 ? getBranchLabelById(branchIds[0]) : (branchIds.length > 1 ? 'Nhiều CN' : '');
            const partnerName = list.find(t => t.partnerName)?.partnerName || '';
            const total = getVoucherTotalByType(first.type, list);
            return {
                ref,
                date: first.date,
                type: first.type,
                typeLabel: meta.label,
                typeColor: meta.colorClass,
                branchLabel,
                partnerName,
                lines: list.length,
                total
            };
        });

        const filteredRows = rows.filter(r => {
            if (!keyword) return true;
            return `${r.ref} ${r.typeLabel} ${r.branchLabel} ${r.partnerName}`.toLowerCase().includes(keyword);
        });

        filteredRows.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.ref).localeCompare(String(a.ref)));

        tbody.innerHTML = filteredRows.map(v => `
            <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                <td class="p-4 font-mono text-slate-200">${v.ref}</td>
                <td class="p-4 text-slate-300">${v.date}</td>
                <td class="p-4 ${v.typeColor} font-semibold">${v.typeLabel}</td>
                <td class="p-4 text-slate-300">${branchId === 'all' ? v.branchLabel : ''}</td>
                <td class="p-4 text-slate-200">${v.partnerName || ''}</td>
                <td class="p-4 text-right font-mono text-slate-200">${formatCurrency(v.total)}</td>
                <td class="p-4 text-right font-mono text-slate-400">${v.lines}</td>
                <td class="p-4 text-center">
                    <button type="button" class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50" onclick="openVoucherDetail('${v.ref}')">
                        Xem chi tiết
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function renderLedger() {
        const select = document.getElementById('ledger-account');
        if (!select) return;
        const accountId = select.value;
        const branchId = getSelectedBranchId('ledger-branch-filter');
        const tbody = document.getElementById('ledger-table');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!accountId) return;
        
        // Get all transactions for this account
        const accountTxns = getTransactionsByBranch(branchId).filter(t => t.debitAccountId === accountId || t.creditAccountId === accountId);
        
        // Reset and recalculate for accurate running balance
        let tempBalance = 0;
        
        accountTxns.forEach(txn => {
            let debit = 0;
            let credit = 0;
            
            if (txn.debitAccountId === accountId) {
                debit = txn.amount;
                tempBalance += txn.amount;
            }
            if (txn.creditAccountId === accountId) {
                credit = txn.amount;
                tempBalance -= txn.amount;
            }

            const branchHint = branchId === 'all'
                ? `<div class="mt-1 text-xs text-cyan-400">${getBranchLabelById(txn.branchId)}</div>`
                : '';
            
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 text-slate-300">${txn.date}</td>
                    <td class="p-4 text-slate-300">${txn.desc} <span class="text-slate-500 text-xs">(${txn.ref})</span>${branchHint}</td>
                    <td class="p-4 text-right font-mono text-green-400">${debit > 0 ? formatCurrency(debit) : ''}</td>
                    <td class="p-4 text-right font-mono text-red-400">${credit > 0 ? formatCurrency(credit) : ''}</td>
                    <td class="p-4 text-right font-mono ${tempBalance >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(tempBalance)}</td>
                </tr>
            `);
        });
    }

    function renderBalanceSheet() {
        const assetsDiv = document.getElementById('balance-assets');
        const liabilitiesDiv = document.getElementById('balance-liabilities');
        if (!assetsDiv || !liabilitiesDiv) return;
        const branchId = getSelectedBranchId('balance-branch-filter');
        
        const rootAccounts = Object.values(accounts).filter(a => !a.parentId);
        
        let totalAssets = 0;
        let totalLiabilities = 0;
        assetsDiv.innerHTML = '';
        liabilitiesDiv.innerHTML = '';

        if (branchId === 'all') {
            const branchIds = branches.map(b => b.id);
            const totalAssetsByBranch = branchIds.map(() => 0);
            const totalLiabilitiesByBranch = branchIds.map(() => 0);

            const headerCols = branchIds.map(id => `<th class="text-right p-3 font-semibold text-slate-300">${id}</th>`).join('');

            let assetsRows = '';
            let liabilitiesRows = '';

            rootAccounts.forEach(account => {
                const isAsset = account.type === 'Tài sản';
                const balancesByBranch = branchIds.map(id => getAccountBalanceByBranch(account.id, id));
                let totalBalance = getAccountBalance(account.id);
                if (account.code === '136' || account.code === '336') {
                    totalBalance = 0;
                }

                const hasAny = balancesByBranch.some(v => Math.abs(v) > 0.0001) || Math.abs(totalBalance) > 0.0001;
                if (!hasAny) return;

                balancesByBranch.forEach((v, idx) => {
                    if (isAsset) totalAssetsByBranch[idx] += v;
                    else totalLiabilitiesByBranch[idx] += v;
                });

                if (isAsset) totalAssets += totalBalance;
                else totalLiabilities += totalBalance;

                const cols = balancesByBranch.map(v => `<td class="p-3 text-right font-mono ${isAsset ? 'text-slate-200' : 'text-slate-200'}">${isAsset ? formatCurrency(v) : formatCurrency(-v)}</td>`).join('');
                const totalCol = `<td class="p-3 text-right font-mono font-semibold text-cyan-200">${isAsset ? formatCurrency(totalBalance) : formatCurrency(-totalBalance)}</td>`;

                const rowHtml = `
                    <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                        <td class="p-3 text-slate-300"><span class="font-mono text-xs text-slate-500 mr-2">${account.code}</span>${account.name}</td>
                        ${cols}
                        ${totalCol}
                    </tr>
                `;

                if (isAsset) assetsRows += rowHtml;
                else liabilitiesRows += rowHtml;
            });

            const totalsColsAssets = totalAssetsByBranch.map(v => `<td class="p-3 text-right font-mono font-bold text-slate-100">${formatCurrency(v)}</td>`).join('');
            const totalsColsLiab = totalLiabilitiesByBranch.map(v => `<td class="p-3 text-right font-mono font-bold text-slate-100">${formatCurrency(-v)}</td>`).join('');

            assetsDiv.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-800/60">
                            <tr>
                                <th class="text-left p-3 font-semibold text-slate-300">Chỉ tiêu</th>
                                ${headerCols}
                                <th class="text-right p-3 font-semibold text-cyan-200">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>${assetsRows}</tbody>
                        <tfoot class="border-t border-slate-700 bg-slate-900/40">
                            <tr>
                                <td class="p-3 font-semibold text-slate-200">Tổng tài sản</td>
                                ${totalsColsAssets}
                                <td class="p-3 text-right font-mono font-bold text-cyan-200">${formatCurrency(totalAssets)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;

            liabilitiesDiv.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-800/60">
                            <tr>
                                <th class="text-left p-3 font-semibold text-slate-300">Chỉ tiêu</th>
                                ${headerCols}
                                <th class="text-right p-3 font-semibold text-cyan-200">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>${liabilitiesRows}</tbody>
                        <tfoot class="border-t border-slate-700 bg-slate-900/40">
                            <tr>
                                <td class="p-3 font-semibold text-slate-200">Tổng nguồn vốn</td>
                                ${totalsColsLiab}
                                <td class="p-3 text-right font-mono font-bold text-cyan-200">${formatCurrency(-totalLiabilities)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        } else {
            rootAccounts.forEach(account => {
                const balance = getAccountBalanceByBranch(account.id, branchId);

                if (account.type === 'Tài sản') {
                    totalAssets += balance;
                    assetsDiv.insertAdjacentHTML('beforeend', `
                        <div class="flex justify-between items-center py-2 border-b border-slate-800">
                            <span class="text-slate-300"><span class="font-mono text-sm text-slate-500 mr-2">${account.code}</span>${account.name}</span>
                            <span class="font-mono text-slate-200">${formatCurrency(balance)}</span>
                        </div>
                    `);
                } else {
                    totalLiabilities += balance;
                    liabilitiesDiv.insertAdjacentHTML('beforeend', `
                        <div class="flex justify-between items-center py-2 border-b border-slate-800">
                            <span class="text-slate-300"><span class="font-mono text-sm text-slate-500 mr-2">${account.code}</span>${account.name}</span>
                            <span class="font-mono text-slate-200">${formatCurrency(-balance)}</span>
                        </div>
                    `);
                }
            });
        }

        document.getElementById('total-assets').textContent = formatCurrency(totalAssets);
        document.getElementById('total-liabilities').textContent = formatCurrency(-totalLiabilities);
        
        const statusDiv = document.getElementById('balance-status');
        if (Math.abs(totalAssets + totalLiabilities) < 1) { // Floating point
            statusDiv.className = 'mt-6 glassmorphism rounded-xl p-6 text-center bg-emerald-900/20 border border-emerald-700/50';
            statusDiv.innerHTML = `<p class="text-emerald-300 font-semibold text-lg">✓ Bảng cân bằng hoàn hảo!</p><p class="text-slate-400 text-sm">Tổng Tài Sản = Tổng Nguồn Vốn</p>`;
        } else {
            statusDiv.className = 'mt-6 glassmorphism rounded-xl p-6 text-center bg-red-900/20 border border-red-700/50';
            statusDiv.innerHTML = `<p class="text-red-300 font-semibold text-lg">✗ Bảng không cân bằng!</p><p class="text-slate-400 text-sm">Chênh lệch: ${formatCurrency(totalAssets + totalLiabilities)}</p>`;
        }
    }

    function renderDashboard() {
        const branchId = getSelectedBranchId('dashboard-branch-filter');
        const cashEl = document.getElementById('dash-cash');
        const revenueEl = document.getElementById('dash-revenue');
        const expenseEl = document.getElementById('dash-expense');
        const inventoryEl = document.getElementById('dash-inventory');
        const inventoryList = document.getElementById('dash-inventory-list');

        const cashBalance = branchId === 'all'
            ? getAccountBalance('id_111') + getAccountBalance('id_112')
            : getAccountBalanceByBranch('id_111', branchId) + getAccountBalanceByBranch('id_112', branchId);

        const revenueBalance = branchId === 'all'
            ? -(getAccountBalance('id_511') + getAccountBalance('id_711'))
            : -(getAccountBalanceByBranch('id_511', branchId) + getAccountBalanceByBranch('id_711', branchId));

        const expenseBalance = branchId === 'all'
            ? getAccountBalance('id_632') + getAccountBalance('id_642') + getAccountBalance('id_811') + getAccountBalance('id_821')
            : getAccountBalanceByBranch('id_632', branchId) + getAccountBalanceByBranch('id_642', branchId) + getAccountBalanceByBranch('id_811', branchId) + getAccountBalanceByBranch('id_821', branchId);

        if (cashEl) cashEl.textContent = formatCurrency(cashBalance);
        if (revenueEl) revenueEl.textContent = formatCurrency(revenueBalance);
        if (expenseEl) expenseEl.textContent = formatCurrency(expenseBalance);

        if (inventoryEl) {
            if (branchId === 'all') {
                const totalInventory = products.reduce((sum, p) => sum + p.totalValue, 0);
                inventoryEl.textContent = formatCurrency(totalInventory);
            } else {
                const stockMap = productStocksByBranch[branchId] || {};
                const totalInventory = products.reduce((sum, p) => sum + (stockMap[p.id]?.totalValue || 0), 0);
                inventoryEl.textContent = formatCurrency(totalInventory);
            }
        }
        
        if (inventoryList) {
            inventoryList.innerHTML = '';
            const stockMap = branchId === 'all' ? null : (productStocksByBranch[branchId] || {});
            products.forEach(p => {
                const qty = stockMap ? (stockMap[p.id]?.quantity || 0) : p.quantity;
                const totalValue = stockMap ? (stockMap[p.id]?.totalValue || 0) : p.totalValue;
                const avgCost = stockMap ? (stockMap[p.id]?.avgCost || 0) : p.avgCost;
                inventoryList.insertAdjacentHTML('beforeend', `
                    <div class="bg-slate-800/50 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p class="font-medium">${p.name}</p>
                            <p class="text-sm text-slate-400">Tồn kho: ${qty} sản phẩm</p>
                        </div>
                        <div class="text-right">
                            <p class="font-mono text-purple-400">${formatCurrency(totalValue)}</p>
                            <p class="text-xs text-slate-500">ĐG trung bình: ${formatCurrency(avgCost)}</p>
                        </div>
                    </div>
                `);
            });
        }
    }

    function renderInventory() {
        const branchId = getSelectedBranchId('inventory-branch-filter');
        const tbody = document.getElementById('inventory-table');
        if (!tbody) return;
        tbody.innerHTML = '';

        const stockMap = branchId === 'all' ? null : (productStocksByBranch[branchId] || {});
        products.filter(p => p.productType !== 'MON_AN').forEach(p => {
            const qty = stockMap ? (stockMap[p.id]?.quantity || 0) : p.quantity;
            const avgCost = stockMap ? (stockMap[p.id]?.avgCost || 0) : p.avgCost;
            const totalValue = stockMap ? (stockMap[p.id]?.totalValue || 0) : p.totalValue;
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 font-mono text-slate-400">${p.id}</td>
                    <td class="p-4 text-slate-200 font-medium">${p.name}</td>
                    <td class="p-4 text-right font-mono text-slate-200">${qty} sp</td>
                    <td class="p-4 text-right font-mono text-slate-400">${formatCurrency(avgCost)}</td>
                    <td class="p-4 text-right font-mono text-purple-400">${formatCurrency(totalValue)}</td>
                </tr>
            `);
        });
    }

    function renderFixedAssets() {
        const tbody = document.getElementById('assets-table');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        fixedAssets.forEach(a => {
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 text-slate-200 font-medium">${a.name}</td>
                    <td class="p-4 text-right font-mono text-slate-400">${formatCurrency(a.initialValue)}</td>
                    <td class="p-4 text-right font-mono text-slate-400">${formatCurrency(a.depreciationPerMonth)}</td>
                    <td class="p-4 text-right font-mono text-yellow-400">${formatCurrency(a.remainingValue)}</td>
                    <td class="p-4 text-right font-mono text-slate-400">${a.remainingMonths} tháng</td>
                </tr>
            `);
        });
    }

    function renderReceivablesPayables() {
        const receivablesTable = document.getElementById('receivables-table');
        const payablesTable = document.getElementById('payables-table');
        const partnersTable = document.getElementById('partners-table');
        if (!receivablesTable || !payablesTable || !partnersTable) return;
        const branchId = getSelectedBranchId('receivables-branch-filter');
        
        receivablesTable.innerHTML = '';
        payablesTable.innerHTML = '';
        partnersTable.innerHTML = '';
        
        // Calculate partner balances
        const receivablesBalance = branchId === 'all' ? getAccountBalance('id_131') : getAccountBalanceByBranch('id_131', branchId);
        const payablesBalance = branchId === 'all' ? getAccountBalance('id_331') : getAccountBalanceByBranch('id_331', branchId);
        
        receivablesTable.innerHTML = `
            <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                <td class="p-4 text-slate-200 font-medium">Phải thu khách hàng</td>
                <td class="p-4 text-right font-mono text-green-400">${formatCurrency(receivablesBalance)}</td>
            </tr>
        `;
        
        payablesTable.innerHTML = `
            <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                <td class="p-4 text-slate-200 font-medium">Phải trả người bán</td>
                <td class="p-4 text-right font-mono text-red-400">${formatCurrency(-payablesBalance)}</td>
            </tr>
        `;

        document.getElementById('total-receivables').textContent = formatCurrency(receivablesBalance);
        document.getElementById('total-payables').textContent = formatCurrency(-payablesBalance);

        partners.forEach(partner => {
            const typeLabel = partner.type === 'customer' ? 'Khách hàng' : partner.type === 'supplier' ? 'Nhà cung cấp' : 'Cả hai';
            partnersTable.insertAdjacentHTML('beforeend', `
                <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                    <td class="p-4 text-slate-200 font-medium">${partner.name}</td>
                    <td class="p-4 text-left text-slate-400">${typeLabel}</td>
                </tr>
            `);
        });
    }

    function renderCashFlow() {
        const cashInEl = document.getElementById('cash-in');
        const cashOutEl = document.getElementById('cash-out');
        const cashBalanceEl = document.getElementById('cash-balance');
        const cashFlowTable = document.getElementById('cash-flow-table');
        if (!cashInEl || !cashOutEl || !cashBalanceEl || !cashFlowTable) return;
        const branchId = getSelectedBranchId('cashflow-branch-filter');

        let totalIn = 0;
        let totalOut = 0;

        cashFlowTable.innerHTML = '';

        getTransactionsByBranch(branchId).forEach(txn => {
            if (branchId === 'all' && isInterBranchTransferTransaction(txn)) return;
            let inAmount = 0;
            let outAmount = 0;
            
            if (txn.debitAccountId === 'id_111' || txn.debitAccountId === 'id_112') {
                inAmount = txn.amount;
                totalIn += inAmount;
            }
            if (txn.creditAccountId === 'id_111' || txn.creditAccountId === 'id_112') {
                outAmount = txn.amount;
                totalOut += outAmount;
            }

            if (inAmount > 0 || outAmount > 0) {
                let typeColor = 'text-slate-400';
                let typeLabel = txn.type;
                if (txn.type === 'receive') { typeColor = 'text-green-400'; typeLabel = 'Phiếu thu'; }
                if (txn.type === 'pay') { typeColor = 'text-red-400'; typeLabel = 'Phiếu chi'; }
                if (txn.type === 'import') { typeColor = 'text-blue-400'; typeLabel = 'Nhập kho'; }
                if (txn.type === 'export') { typeColor = 'text-orange-400'; typeLabel = 'Xuất kho'; }
                if (txn.type === 'closing') { typeColor = 'text-cyan-400'; typeLabel = 'Kết chuyển'; }
                if (txn.type === 'interbranch') { typeColor = 'text-fuchsia-400'; typeLabel = 'Điều chuyển'; }

                const branchHint = branchId === 'all'
                    ? `<div class="mt-1 text-xs text-cyan-400">${getBranchLabelById(txn.branchId)}</div>`
                    : '';

                cashFlowTable.insertAdjacentHTML('beforeend', `
                    <tr class="border-t border-slate-800 hover:bg-slate-800/30">
                        <td class="p-4 text-slate-300">${txn.date}</td>
                        <td class="p-4 ${typeColor} font-medium">${typeLabel}</td>
                        <td class="p-4 text-slate-300">${txn.desc}${branchHint}</td>
                        <td class="p-4 text-right font-mono text-green-400">${inAmount > 0 ? formatCurrency(inAmount) : ''}</td>
                        <td class="p-4 text-right font-mono text-red-400">${outAmount > 0 ? formatCurrency(outAmount) : ''}</td>
                    </tr>
                `);
            }
        });

        cashInEl.textContent = formatCurrency(totalIn);
        cashOutEl.textContent = formatCurrency(totalOut);
        const cashBalance = branchId === 'all'
            ? getAccountBalance('id_111') + getAccountBalance('id_112')
            : getAccountBalanceByBranch('id_111', branchId) + getAccountBalanceByBranch('id_112', branchId);
        cashBalanceEl.textContent = formatCurrency(cashBalance);
    }

    function populateAccountSelects() {
        const selects = [
            'new-acc-parent', 'recv-debit', 'recv-credit', 
            'pay-debit', 'pay-credit', 'ledger-account',
            'import-debit-inventory', 'import-debit-vat', 'import-credit-pay',
            'export-debit-cogs', 'export-credit-inventory', 'export-debit-pay',
            'export-credit-revenue', 'export-credit-vat',
            'fnb-credit-revenue', 'fnb-credit-vat', 'fnb-debit-cogs', 'fnb-credit-material'
        ];
        
        const branchContextMap = {
            'recv-debit': 'recv-branch',
            'recv-credit': 'recv-branch',
            'pay-debit': 'pay-branch',
            'pay-credit': 'pay-branch',
            'import-debit-inventory': 'import-branch',
            'import-debit-vat': 'import-branch',
            'import-credit-pay': 'import-branch',
            'export-debit-cogs': 'export-branch',
            'export-credit-inventory': 'export-branch',
            'export-debit-pay': 'export-branch',
            'export-credit-revenue': 'export-branch',
            'export-credit-vat': 'export-branch',
            'fnb-credit-revenue': 'fnb-branch',
            'fnb-credit-vat': 'fnb-branch',
            'fnb-debit-cogs': 'fnb-branch',
            'fnb-credit-material': 'fnb-branch',
            'ledger-account': 'ledger-branch-filter'
        };

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            const isParentSelect = selectId === 'new-acc-parent';
            
            const currentValue = select.value;
            select.innerHTML = isParentSelect ? '<option value="">Không có - Là tài khoản cha</option>' : '';

            const branchSelectorId = branchContextMap[selectId] || null;
            const branchId = branchSelectorId ? getSelectedBranchId(branchSelectorId) : 'all';

            const filteredAccounts = Object.values(accounts)
                .filter(account => {
                    if (account.code === '000') return false;
                    if (isParentSelect) {
                        return getAccountBranchId(account) === null;
                    }
                    if (!isAccountVisibleInBranch(account, branchId)) return false;
                    if (!isAccountSelectableInBranch(account, branchId)) return false;
                    if (account.isParent && Array.isArray(account.children)) {
                        const visibleChildrenCount = account.children.filter(childId => {
                            const child = accounts[childId];
                            return child && isAccountVisibleInBranch(child, branchId);
                        }).length;
                        if (visibleChildrenCount > 0) return false;
                    }
                    return true;
                })
                .sort((a, b) => a.code.localeCompare(b.code, 'vi'));
            
            filteredAccounts.forEach(account => {
                const opt = document.createElement('option');
                opt.value = account.id;
                if (getAccountBranchId(account) && branchId === 'all') {
                    opt.textContent = `${account.code} - ${account.name} (${getAccountBranchId(account)})`;
                } else {
                    opt.textContent = `${account.code} - ${account.name}`;
                }
                select.appendChild(opt);
            });
            
            select.value = currentValue;
        });
        
        // Set default values for import/export custom accounts
        const importInvDebit = document.getElementById('import-debit-inventory');
        if (importInvDebit) importInvDebit.value = 'id_156';
        
        const importVatDebit = document.getElementById('import-debit-vat');
        if (importVatDebit) importVatDebit.value = 'id_133';
        
        const importCredit = document.getElementById('import-credit-pay');
        const importPaymentType = document.getElementById('import-payment')?.value;
        if (importCredit) {
            importCredit.value = importPaymentType === 'cash' ? 'id_111' : 'id_331';
        }
        
        const exportCogsDebit = document.getElementById('export-debit-cogs');
        if (exportCogsDebit) exportCogsDebit.value = 'id_632';
        
        const exportInvCredit = document.getElementById('export-credit-inventory');
        if (exportInvCredit) exportInvCredit.value = 'id_156';
        
        const exportPayDebit = document.getElementById('export-debit-pay');
        const exportPaymentType = document.getElementById('export-payment')?.value;
        if (exportPayDebit) {
            exportPayDebit.value = exportPaymentType === 'cash' ? 'id_111' : 'id_131';
        }
        
        const exportRevCredit = document.getElementById('export-credit-revenue');
        if (exportRevCredit) exportRevCredit.value = 'id_511';
        
        const exportVatCredit = document.getElementById('export-credit-vat');
        if (exportVatCredit) exportVatCredit.value = 'id_3331';

        const fnbRevCredit = document.getElementById('fnb-credit-revenue');
        if (fnbRevCredit) fnbRevCredit.value = 'id_511';

        const fnbVatCredit = document.getElementById('fnb-credit-vat');
        if (fnbVatCredit) fnbVatCredit.value = 'id_3331';

        const fnbCogsDebit = document.getElementById('fnb-debit-cogs');
        if (fnbCogsDebit) fnbCogsDebit.value = 'id_632';

        const fnbMaterialCredit = document.getElementById('fnb-credit-material');
        if (fnbMaterialCredit) fnbMaterialCredit.value = 'id_156';
    }

    // ==========================================
    // OPENING BALANCE FUNCTIONS
    // ==========================================
    function renderOpeningBalance() {
        const table = document.getElementById('opening-balance-table');
        const inventoryTable = document.getElementById('opening-balance-inventory-table');
        if (!table) return;

        table.innerHTML = '';
        Object.values(accounts)
            .filter(acc => acc.code !== "000") // Don't show intermediary account
            .forEach(account => {
                const tr = document.createElement('tr');
                tr.className = "border-t border-slate-700 hover:bg-slate-800/30";
                tr.innerHTML = `
                    <td class="p-4 text-slate-300 font-mono">${account.code}</td>
                    <td class="p-4 text-slate-200">${account.name}</td>
                    <td class="p-4">
                        <input type="number" 
                               id="ob-${account.id}" 
                               class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 text-right"
                               value="${openingBalances[account.id] || 0}">
                    </td>
                `;
                table.appendChild(tr);
            });

        if (inventoryTable) {
            inventoryTable.innerHTML = '';
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.className = "border-t border-slate-700 hover:bg-slate-800/30";
                tr.innerHTML = `
                    <td class="p-4 text-slate-300 font-mono">${product.id}</td>
                    <td class="p-4 text-slate-200">${product.name}</td>
                    <td class="p-4">
                        <input type="number" 
                               id="ob-qty-${product.id}" 
                               class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-right"
                               value="${product.quantity}" onchange="calculateOpeningInventoryTotal('${product.id}')">
                    </td>
                    <td class="p-4">
                        <input type="number" 
                               id="ob-price-${product.id}" 
                               class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-right"
                               value="${product.avgCost}" onchange="calculateOpeningInventoryTotal('${product.id}')">
                    </td>
                    <td class="p-4 text-right text-slate-200 font-mono" id="ob-total-${product.id}">${formatCurrency(product.totalValue)}</td>
                `;
                inventoryTable.appendChild(tr);
            });
        }
    }

    function calculateOpeningInventoryTotal(productId) {
        const qty = parseFloat(document.getElementById(`ob-qty-${productId}`).value) || 0;
        const price = parseFloat(document.getElementById(`ob-price-${productId}`).value) || 0;
        const total = qty * price;
        document.getElementById(`ob-total-${productId}`).textContent = formatCurrency(total);
    }

    function saveOpeningBalance() {
        // Reset all account balances to 0 first
        Object.values(accounts).forEach(acc => acc.balance = 0);

        let intermediaryBalance = 0;

        // Process each account's opening balance
        Object.values(accounts)
            .filter(acc => acc.code !== "000")
            .forEach(account => {
                const input = document.getElementById(`ob-${account.id}`);
                if (input) {
                    const value = parseFloat(input.value) || 0;
                    openingBalances[account.id] = value;
                    
                    if (value !== 0) {
                        // Check account type to determine debit/credit
                        if (account.type === "Tài sản" || account.type === "Chi phí") {
                            // Debit the account, Credit intermediary
                            accounts[account.id].balance += value;
                            intermediaryBalance -= value;
                        } else {
                            // Credit the account, Debit intermediary
                            accounts[account.id].balance -= value;
                            intermediaryBalance += value;
                        }
                    }
                }
            });

        // Now update products for inventory opening balance
        products.forEach(product => {
            const qtyInput = document.getElementById(`ob-qty-${product.id}`);
            const priceInput = document.getElementById(`ob-price-${product.id}`);
            if (qtyInput && priceInput) {
                const qty = parseFloat(qtyInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                product.quantity = qty;
                product.avgCost = price;
                product.totalValue = qty * price;
            }
        });

        updateInventoryAccount();
        updateFixedAssetAccount();

        // Set intermediary account balance
        accounts["id_000"].balance = intermediaryBalance;

        // Show status
        const statusEl = document.getElementById('opening-balance-status');
        statusEl.classList.remove('hidden');
        
        if (Math.abs(intermediaryBalance) < 1) {
            statusEl.className = "mt-6 glassmorphism rounded-xl p-6 text-center bg-emerald-900/30 border border-emerald-700/50";
            statusEl.innerHTML = `<p class="text-emerald-300 font-semibold text-lg">✓ Hệ thống cân bằng hoàn hảo!</p>`;
        } else {
            statusEl.className = "mt-6 glassmorphism rounded-xl p-6 text-center bg-red-900/30 border border-red-700/50";
            statusEl.innerHTML = `<p class="text-red-300 font-semibold text-lg">⚠ Hệ thống chưa cân bằng!</p><p class="text-slate-400 mt-2">Chênh lệch: ${formatCurrency(intermediaryBalance)}</p>`;
        }

        renderAll();
    }

    function resetOpeningBalance() {
        openingBalances = {};
        renderOpeningBalance();
        document.getElementById('opening-balance-status').classList.add('hidden');
    }

    // ==========================================
    // LOCK PERIOD FUNCTIONS
    // ==========================================
    function renderLockPeriodTable() {
        const tbody = document.getElementById('lock-period-table');
        if (!tbody) return;

        tbody.innerHTML = '';
        const currentYear = new Date().getFullYear();
        const scope = getSelectedBranchId('lock-period-branch-filter') || getDefaultBranchId();
        
        for (let month = 1; month <= 12; month++) {
            const key = `${currentYear}-${String(month).padStart(2, '0')}`;
            const periodData = getEffectiveLockedPeriodData(scope, key);

            const tr = document.createElement('tr');
            tr.className = "border-t border-slate-700 hover:bg-slate-800/30";
            tr.innerHTML = `
                <td class="p-4 text-slate-200">Tháng ${month}/${currentYear}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${periodData.isLocked ? 'bg-pink-900/50 text-pink-300' : 'bg-slate-700 text-slate-300'}">
                        ${periodData.isLocked ? '🔒 Đã khóa' : '🔓 Mở'}
                    </span>
                </td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${periodData.isClosed ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300'}">
                        ${periodData.isClosed ? '✓ Đã kết chuyển' : 'Chưa kết chuyển'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        }
    }

    function lockPeriod() {
        const month = parseInt(document.getElementById('lock-month').value);
        const year = parseInt(document.getElementById('lock-year').value);
        const key = `${year}-${String(month).padStart(2, '0')}`;
        const scope = getSelectedBranchId('lock-period-branch-filter') || getDefaultBranchId();
        const branchIds = scope === 'all' ? branches.map(b => b.id) : [scope];
        
        // Check if closed
        const notClosedBranches = branchIds.filter(branchId => !getEffectiveLockedPeriodData(branchId, key).isClosed);
        if (notClosedBranches.length > 0) {
            alert(`Chưa kết chuyển nên chưa thể khóa sổ: ${notClosedBranches.map(id => getBranchLabelById(id)).join(', ')}`);
            return;
        }
        branchIds.forEach(branchId => {
            const periodData = getLockedPeriodDataByBranch(branchId, key);
            periodData.isLocked = true;
        });
        if (scope === 'all') {
            const periodData = getLockedPeriodDataByBranch('all', key);
            periodData.isLocked = true;
        }

        // Lock all transactions in that period
        transactions.forEach(txn => {
            const txnDate = new Date(txn.date);
            if (txnDate.getFullYear() === year && txnDate.getMonth() + 1 === month) {
                if (scope === 'all' || txn.branchId === scope) {
                    txn.isLocked = true;
                }
            }
        });

        renderLockPeriodTable();
        renderAll();
        alert(`Đã khóa sổ ${scope === 'all' ? 'Toàn công ty' : getBranchLabelById(scope)} Tháng ${month}/${year}!`);
    }

    function unlockPeriod() {
        const month = parseInt(document.getElementById('lock-month').value);
        const year = parseInt(document.getElementById('lock-year').value);
        const key = `${year}-${String(month).padStart(2, '0')}`;
        const scope = getSelectedBranchId('lock-period-branch-filter') || getDefaultBranchId();
        const branchIds = scope === 'all' ? branches.map(b => b.id) : [scope];
        
        branchIds.forEach(branchId => {
            const periodData = getLockedPeriodDataByBranch(branchId, key);
            periodData.isLocked = false;
        });
        if (scope === 'all') {
            const periodData = getLockedPeriodDataByBranch('all', key);
            periodData.isLocked = false;
        }

        // Unlock all transactions in that period
        transactions.forEach(txn => {
            const txnDate = new Date(txn.date);
            if (txnDate.getFullYear() === year && txnDate.getMonth() + 1 === month) {
                if (scope === 'all' || txn.branchId === scope) {
                    txn.isLocked = false;
                }
            }
        });

        renderLockPeriodTable();
        renderAll();
        alert(`Đã mở khóa sổ ${scope === 'all' ? 'Toàn công ty' : getBranchLabelById(scope)} Tháng ${month}/${year}!`);
    }

    const modulePageMap = {
        'dashboard': 'dashboard.html',
        'accounts': 'accounts.html',
        'branches': 'branches.html',
        'inventory': 'inventory.html',
        'fixed-assets': 'fixed-assets.html',
        'voucher-receive': 'voucher-receive.html',
        'voucher-pay': 'voucher-pay.html',
        'voucher-import': 'voucher-import.html',
        'voucher-export': 'voucher-export.html',
        'fnb-orders': 'fnb-orders.html',
        'inter-branch-transfer': 'inter-branch-transfer.html',
        'invoices': 'invoices.html',
        'vouchers': 'vouchers.html',
        'receivables-payables': 'receivables-payables.html',
        'cash-flow': 'cash-flow.html',
        'journal': 'journal.html',
        'ledger': 'ledger.html',
        'closing': 'closing.html',
        'closing-config': 'closing-config.html',
        'opening-balance': 'opening-balance.html',
        'lock-period': 'lock-period.html',
        'balance': 'balance.html'
    };
    const businessDocs = {
        'dashboard': {
            title: 'Tổng quan điều hành',
            overview: 'Đây là trang để người mới nhìn nhanh doanh nghiệp đang có bao nhiêu tiền, doanh thu, chi phí và hàng tồn mà không cần đọc sổ sách chi tiết.',
            sections: [
                { heading: 'Hiểu đơn giản', items: ['Hãy xem trang này như bảng đồng hồ trên ô tô: nó không tạo ra giao dịch mới, nhưng cho bạn biết hệ thống đang khỏe hay có vấn đề.', 'Các chỉ số ở đây lấy từ số dư tài khoản và dữ liệu nghiệp vụ đã nhập ở các page khác.'] },
                { heading: 'Vì sao số ở đây thay đổi', items: ['Khi lập <code>Phiếu Thu</code>, tiền tăng nên chỉ tiêu tiền có thể tăng.', 'Khi lập <code>Phiếu Chi</code>, chi phí hoặc thanh toán công nợ tăng nên tiền có thể giảm.', 'Khi nhập xuất kho, giá trị tồn và giá vốn sẽ thay đổi rồi phản ánh lên dashboard.'] },
                { heading: 'Cho người mới', items: ['Nếu dashboard sai, nguyên nhân thường không nằm ở chính trang này mà nằm ở chứng từ gốc.', 'Vì vậy khi thấy số bất thường, hãy quay lại kiểm tra phiếu thu, phiếu chi, phiếu nhập kho, phiếu xuất kho hoặc số dư đầu kỳ.'] }
            ]
        },
        'accounts': {
            title: 'Hệ thống tài khoản',
            overview: 'Đây là nơi khai báo “ngăn kéo kế toán”. Mỗi tài khoản là một ngăn để hệ thống biết tiền, công nợ, doanh thu hay chi phí đang nằm ở đâu.',
            sections: [
                { heading: 'Vì sao phải có tài khoản', items: ['Kế toán không chỉ ghi “có giao dịch”, mà phải ghi rõ giao dịch đó làm thay đổi cái gì.', 'Ví dụ thu tiền bán hàng không chỉ là “thu 10 triệu”, mà phải biết <strong>tiền tăng ở đâu</strong> và <strong>doanh thu tăng ở đâu</strong>.'] },
                { heading: 'Cách hiểu Nợ và Có cho newbie', items: ['Đừng học thuộc máy móc ngay từ đầu. Với phần mềm này, hãy hiểu: tài sản tăng thường ghi <code>Nợ</code>, tài sản giảm thường ghi <code>Có</code>.', 'Với doanh thu và nguồn vốn thì thường ngược lại: tăng doanh thu hoặc tăng nguồn hình thành tài sản thường ghi <code>Có</code>.'] },
                { heading: 'Vì sao phải tách tài khoản con', items: ['Nếu chỉ dùng <code>642</code>, bạn chỉ biết “có chi phí quản lý”.', 'Nếu tạo thêm <code>6421</code>, <code>6422</code>..., bạn biết rõ chi phí lương, chi phí điện nước hay chi phí văn phòng là bao nhiêu, nhưng cuối cùng vẫn cộng lên tài khoản cha.'] },
                { heading: 'Khi tài khoản cha đã phát sinh', items: ['Nếu một tài khoản cha (ví dụ <code>112</code>) đã có số dư hoặc đã được dùng trong Sổ Nhật Ký, khi bạn tạo tài khoản con (ví dụ <code>1121</code>) hệ thống sẽ tự “chuyển vai” để tránh sửa dữ liệu cũ.', 'Cụ thể: ID cũ (ví dụ <code>id_112</code>) sẽ được đổi thành tài khoản con mặc định <code>1120 - ... - Khác</code> để “hứng” các bút toán lịch sử, và tạo một tài khoản cha tổng hợp mới (ví dụ <code>id_112_new_parent</code>) có mã <code>112</code> để bọc bên ngoài.', 'Vì Sổ Nhật Ký hiển thị theo danh mục tài khoản (lookup theo ID), nên các bút toán cũ tự động hiển thị thành <code>1120 - ... - Khác</code> mà không cần duyệt sửa mảng nhật ký.'] },
                { heading: 'Lưu ý', items: ['Khi thêm tài khoản doanh thu hoặc chi phí mới, nhớ kiểm tra page <code>Cấu hình kết chuyển</code> để cuối kỳ hệ thống chuyển đúng về <code>911</code>.', 'Tài khoản sai loại sẽ làm định khoản sai bản chất, nên đây là nơi rất quan trọng dù không trực tiếp nhập tiền.'] },
                { heading: 'Dùng tài khoản nào cho nghiệp vụ bán hàng', items: ['<strong>TK 152 - Nguyên vật liệu</strong>: dùng khi mua NGUYÊN LIỆU để sản xuất (ví dụ: hạt cafe, sữa đặc, đường). Nhập hàng về ghi <code>Nợ 152 / Có 111, 112 hoặc 331</code>. Khi sản xuất tiêu hao thì ghi <code>Nợ 621 hoặc 632 / Có 152</code>.', '<strong>TK 156 - Hàng hóa</strong>: dùng khi mua HÀNG HÓA về để bán lại mà không qua sản xuất (ví dụ: Áo thun, Quần Jean, iPhone, v.v.). Đây là tài khoản phản ánh hàng tồn kho thương mại. Nhập hàng ghi <code>Nợ 156 / Có 111, 112 hoặc 331</code>. Khi xuất bán ghi <code>Nợ 632 / Có 156</code>.', '<strong>TK 511 - Doanh thu bán hàng</strong>: dùng khi ghi nhận doanh thu từ việc bán hàng hóa hoặc cung cấp dịch vụ. Thường dùng trong Phiếu Xuất Kho hoặc Phiếu Thu với bút toán <code>Nợ 111, 112 hoặc 131 / Có 511</code>.', '<strong>TK 632 - Giá vốn hàng bán</strong>: dùng khi xuất hàng ra khỏi kho để bán. Phản ánh chi phí của số hàng đã tiêu thụ, ghi nhận song song với bút toán doanh thu: <code>Nợ 632 / Có 152 hoặc 156</code>.', '<strong>TK 3331 - Thuế GTGT phải nộp</strong>: dùng khi bán hàng có VAT. Ghi <code>Có 3331</code> để phản ánh nghĩa vụ nộp thuế GTGT đầu ra cho Nhà nước.', '<strong>TK 133 - Thuế GTGT được khấu trừ</strong>: dùng khi mua hàng có VAT. Ghi <code>Nợ 133</code> để phản ánh quyền khấu trừ thuế GTGT đầu vào. Cuối kỳ sẽ bù trừ với <code>3331</code>.', '<strong>TK 131 - Phải thu khách hàng</strong>: dùng khi bán chịu (chưa thu tiền ngay). Ghi <code>Nợ 131</code> để thể hiện khách hàng đang nợ doanh nghiệp.', '<strong>TK 331 - Phải trả người bán</strong>: dùng khi mua chịu (chưa trả tiền ngay). Ghi <code>Có 331</code> để thể hiện doanh nghiệp đang nợ nhà cung cấp.'] },
                { heading: 'Ví dụ luồng bán hàng đầy đủ', items: ['<strong>Bước 1 - Mua hàng</strong>: Nhập kho hàng hóa (156) chưa thuế 100tr + VAT 10% = 110tr. Ghi: <code>Nợ 156 (100tr) / Nợ 133 (10tr) / Có 331 (110tr)</code>.', '<strong>Bước 2 - Bán hàng</strong>: Xuất bán toàn bộ với giá 150tr (chưa VAT), VAT 10%. Ghi giá vốn: <code>Nợ 632 (100tr) / Có 156 (100tr)</code>. Ghi doanh thu: <code>Nợ 131 (165tr) / Có 511 (150tr) / Có 3331 (15tr)</code>.', '<strong>Bước 3 - Thu tiền</strong>: Khách trả nợ. Ghi: <code>Nợ 111 (165tr) / Có 131 (165tr)</code>.', '<strong>Kết quả</strong>: Lợi nhuận gộp = 150tr - 100tr = 50tr. Tiền vào = 165tr. Công nợ = 0. Số thuế GTGT phải nộp = 15tr - 10tr = 5tr.'] }
            ]
        },
        'branches': {
            title: 'Danh mục chi nhánh',
            overview: 'Page này khai báo các đơn vị nội bộ như trụ sở chính, chi nhánh Hà Nội, chi nhánh Đà Nẵng để mỗi chứng từ có thể gắn đúng nơi phát sinh.',
            sections: [
                { heading: 'Vì sao phải có danh mục chi nhánh', items: ['Nếu nhiều chi nhánh cùng dùng chung một hệ thống mà không gắn nơi phát sinh, bạn chỉ xem được số hợp nhất mà không biết chi nhánh nào đang lời hay đang nợ.', 'Danh mục chi nhánh là “chiều phân tích” bổ sung cho hệ thống tài khoản.'] },
                { heading: 'Khác gì với việc tạo tài khoản riêng cho từng chi nhánh', items: ['Tài khoản dùng để mô tả bản chất nghiệp vụ như tiền, doanh thu, công nợ.', 'Chi nhánh dùng để mô tả <strong>nghiệp vụ đó phát sinh ở đâu</strong>. Nhờ vậy không phải nhân bản hàng loạt tài khoản kiểu <code>111-HN</code>, <code>111-DN</code>.'] },
                { heading: 'Hạch toán chung vs hạch toán độc lập', items: ['Trong hệ thống hiện tại, <strong>cả hai chế độ đều dùng chung một bộ tài khoản</strong> (Chart of Accounts cấp công ty). Sự khác biệt nằm ở việc bạn xem số liệu và xử lý cuối kỳ theo <code>branchId</code>.', '<strong>Hạch toán chung</strong>: bạn thường quan tâm số hợp nhất, các báo cáo dùng chế độ <code>Toàn công ty</code>.', '<strong>Hạch toán độc lập</strong>: bạn muốn xem và chốt số liệu <strong>từng chi nhánh</strong> (lọc theo chi nhánh ở báo cáo/sổ, và kết chuyển cuối kỳ theo từng chi nhánh).'] },
                { heading: 'Nếu hạch toán riêng có phải tạo bộ tài khoản mới không', items: ['Không bắt buộc. Cách phổ biến và an toàn nhất là <strong>vẫn dùng chung bộ tài khoản</strong>, nhưng mọi chứng từ bắt buộc chọn chi nhánh để tách sổ theo chi nhánh.', 'Chỉ khi doanh nghiệp muốn mỗi chi nhánh có hệ tài khoản nội bộ khác nhau thì mới cần “bộ tài khoản riêng theo chi nhánh”, khi đó phải có thêm cơ chế mapping hợp nhất. Tính năng mapping này hiện chưa triển khai trong mockup.'] },
                { heading: 'Khi đổi từ chung sang riêng cần làm gì', items: ['(1) Xác định “ngày bắt đầu tách sổ” (từ ngày/tháng nào bắt đầu ghi nhận theo chi nhánh).', '(2) Chuẩn hóa nhập liệu: từ thời điểm đó, mọi phiếu Thu/Chi/Nhập/Xuất/TSCĐ phải chọn đúng chi nhánh.', '(3) Tách số dư đầu kỳ theo chi nhánh: tiền mặt, ngân hàng, công nợ, thuế, vốn… nếu muốn báo cáo chi nhánh đúng, cần có số dư mở đầu cho từng chi nhánh (hoặc chấp nhận chỉ tách phát sinh từ ngày bắt đầu).', '(4) Tách tồn kho theo chi nhánh: kiểm kê và nhập lại tồn đầu kỳ cho từng chi nhánh (hệ thống kho theo chi nhánh sẽ phản ánh đúng xuất/nhập của từng nơi).', '(5) Gán tài sản cố định cho chi nhánh: để khấu hao và chi phí 642 đi đúng chi nhánh.', '(6) Chạy thử báo cáo theo từng chi nhánh (Nhật ký, Sổ chi tiết, Dòng tiền, Công nợ, Kho) để đối chiếu trước khi khóa sổ.'] },
                { heading: 'Nghiệp vụ cần lưu ý khi vận hành chi nhánh độc lập', items: ['Nếu có điều chuyển hàng giữa chi nhánh, về nghiệp vụ cần có chứng từ điều chuyển (giảm kho chi nhánh A, tăng kho chi nhánh B). Mockup hiện chưa có chứng từ điều chuyển riêng, nên tạm thời phải thao tác bằng 2 phiếu (xuất ở A, nhập ở B) để số kho đúng theo chi nhánh.', 'Nếu có điều chuyển tiền giữa chi nhánh, cũng cần ghi nhận rõ chi nhánh nguồn và chi nhánh đích để dòng tiền/111/112 theo chi nhánh không bị sai.', 'Nếu bán hàng/thu tiền tại chi nhánh nhưng hóa đơn hoặc công nợ do trụ sở quản lý, bạn cần thống nhất quy tắc: công nợ “thuộc” chi nhánh bán hay “thuộc” trụ sở, để báo cáo công nợ theo chi nhánh không bị hiểu sai.'] },
                { heading: 'Cho người mới', items: ['Tài khoản trả lời câu hỏi “giao dịch làm thay đổi cái gì”. Chi nhánh trả lời câu hỏi “giao dịch đó thuộc đơn vị nào”.', 'Muốn tách sổ chi nhánh đúng, điều quan trọng nhất là <strong>đừng quên chọn chi nhánh khi lập phiếu</strong> và phải thống nhất quy ước vận hành (kho, tiền, công nợ thuộc chi nhánh nào).'] }
            ]
        },
        'inter-branch-transfer': {
            title: 'Phiếu điều chuyển nội bộ',
            overview: 'Dùng khi chuyển tiền hoặc chuyển hàng giữa các chi nhánh. Mỗi chi nhánh sẽ ghi một bút toán riêng để báo cáo chi nhánh không bị sai.',
            sections: [
                { heading: 'Nguyên tắc kế toán (cốt lõi)', items: ['Khi chuyển nội bộ, về mặt “toàn công ty” không làm tăng/giảm tài sản với bên ngoài, nhưng từng chi nhánh thì có tăng/giảm.', 'Vì vậy hệ thống dùng cặp tài khoản nội bộ: <code>136</code> (phải thu nội bộ) và <code>336</code> (phải trả nội bộ) để hai bên ghi nhận đối ứng đúng bản chất.'] },
                { heading: 'Tại chi nhánh xuất (nguồn)', items: ['Nếu chuyển <strong>tiền</strong>: chi nhánh xuất bị giảm tiền nên ghi <code>Có 111/112</code>. Đồng thời ghi <code>Nợ 136</code> để thể hiện “chi nhánh khác đang nợ lại chi nhánh này”.', 'Nếu chuyển <strong>hàng</strong>: chi nhánh xuất bị giảm tồn kho nguyên vật liệu/hàng hóa nên ghi <code>Có 152</code>. Đồng thời ghi <code>Nợ 136</code>.'] },
                { heading: 'Tại chi nhánh nhận (đích)', items: ['Nếu nhận <strong>tiền</strong>: chi nhánh nhận tăng tiền nên ghi <code>Nợ 111/112</code>. Đồng thời ghi <code>Có 336</code> để thể hiện “chi nhánh này đang nợ nội bộ”.', 'Nếu nhận <strong>hàng</strong>: chi nhánh nhận tăng tồn kho nguyên vật liệu/hàng hóa nên ghi <code>Nợ 152</code> và đối ứng <code>Có 336</code>.'] },
                { heading: 'Khi xem Toàn công ty (hợp nhất)', items: ['Hai tài khoản <code>136</code> và <code>336</code> sẽ bị triệt tiêu (elimination) vì chỉ là công nợ nội bộ.', 'Báo cáo dòng tiền hợp nhất sẽ loại giao dịch điều chuyển để không bị phình to ảo (vì nội bộ vừa chi ra ở nơi này vừa thu vào ở nơi khác).'] }
            ]
        },
        'inventory': {
            title: 'Quản lý kho',
            overview: 'Trang này cho biết doanh nghiệp đang còn bao nhiêu hàng và số hàng đó đang được quy đổi thành bao nhiêu tiền trong kế toán.',
            sections: [
                { heading: 'Bản chất nghiệp vụ', items: ['Kho không chỉ là số lượng, mà còn là tài sản của doanh nghiệp.', 'Vì vậy nguyên vật liệu/hàng hóa đang nằm trong kho được phản ánh vào tài khoản <code>152</code>.'] },
                { heading: 'Vì sao tồn kho liên quan đến kế toán', items: ['Mua hàng về mà chưa bán thì chưa phải chi phí ngay, vì hàng đó vẫn còn là tài sản.', 'Chỉ khi xuất bán, một phần giá trị từ kho mới được chuyển thành <code>Giá vốn</code> ở <code>632</code>.'] },
                { heading: 'Cho người mới', items: ['Nếu kho còn nhiều mà tiền ít, nghĩa là tiền đã chuyển hóa thành hàng tồn.', 'Nếu bán hàng mà quên xuất kho, doanh thu có thể tăng nhưng giá vốn không tăng, khiến lãi bị “ảo”.'] }
            ]
        },
        'fixed-assets': {
            title: 'Tài sản cố định',
            overview: 'Tài sản cố định là những thứ doanh nghiệp dùng lâu dài như máy tính, máy in, xe, máy móc. Không ghi hết vào chi phí ngay trong 1 tháng mà phải phân bổ dần.',
            sections: [
                { heading: 'Vì sao không đưa hết vào chi phí ngay', items: ['Nếu mua một chiếc máy tính dùng 3 năm mà ghi hết vào chi phí tháng này thì kết quả tháng đó sẽ bị méo.', 'Kế toán chia dần giá trị tài sản thành nhiều tháng sử dụng, gọi là <strong>khấu hao</strong>.'] },
                { heading: 'Cặp định khoản thường gặp', items: ['Khi ghi nhận tài sản ban đầu: thường là <code>Nợ 211 / Có 111, 112 hoặc 331</code>.', 'Khi khấu hao hàng tháng: thường là <code>Nợ 642 / Có 214</code>.'] },
                { heading: 'Vì sao dùng cặp đó', items: ['<code>211</code> là tài sản cố định, mua tài sản mới nghĩa là tài sản tăng nên ghi <code>Nợ 211</code>.', '<code>214</code> là hao mòn lũy kế, ghi <code>Có 214</code> để thể hiện tài sản đang được phân bổ dần chứ không biến mất ngay.'] },
                { heading: 'Cho người mới', items: ['Hãy tưởng tượng tài sản cố định là “tiền đã biến thành công cụ dùng lâu dài”.', 'Khấu hao là cách chia đều giá trị công cụ đó vào chi phí theo thời gian sử dụng.'] }
            ]
        },
        'voucher-receive': {
            title: 'Phiếu thu',
            overview: 'Phiếu thu dùng khi doanh nghiệp thực sự nhận tiền hoặc tiền vào ngân hàng. Điểm quan trọng nhất là xác định: tiền vào từ đâu.',
            sections: [
                { heading: 'Câu hỏi phải tự hỏi trước khi ghi', items: ['Tiền này vào vì bán hàng, vì khách trả nợ, hay vì chủ góp vốn?', 'Tiền tăng là chắc chắn, nhưng cái gì ở phía đối ứng sẽ thay đổi?'] },
                { heading: 'Cặp định khoản thường gặp', items: ['Thu bán hàng tiền ngay: <code>Nợ 111 hoặc 112 / Có 511</code>.', 'Thu khách hàng trả nợ: <code>Nợ 111 hoặc 112 / Có 131</code>.', 'Chủ doanh nghiệp góp thêm vốn: <code>Nợ 111 hoặc 112 / Có 411</code>.'] },
                { heading: 'Vì sao lại ghi như vậy', items: ['Tiền mặt hoặc tiền gửi là tài sản. Khi nhận tiền, tài sản tăng nên ghi <code>Nợ 111</code> hoặc <code>Nợ 112</code>.', 'Nếu thu do bán hàng thì doanh thu tăng, doanh thu tăng thường ghi <code>Có 511</code>.', 'Nếu thu là khách trả khoản đã nợ trước đó, thì không phải doanh thu mới nữa. Lúc này cần giảm khoản phải thu nên ghi <code>Có 131</code>.', 'Nếu chủ góp thêm vốn, doanh nghiệp không “kiếm ra” tiền mà được chủ bỏ thêm vào, nên phần đối ứng là <code>Có 411</code> chứ không phải <code>Có 511</code>.'] },
                { heading: 'Sai lầm người mới hay gặp', items: ['Thấy tiền vào là ghi ngay vào doanh thu. Điều này sai nếu bản chất chỉ là khách trả nợ cũ hoặc chủ góp vốn.', 'Nhầm giữa <strong>dòng tiền vào</strong> và <strong>doanh thu</strong>. Không phải cứ tiền vào là doanh thu.'] }
            ]
        },
        'voucher-pay': {
            title: 'Phiếu chi',
            overview: 'Phiếu chi dùng khi doanh nghiệp thực chi tiền hoặc chuyển khoản. Điểm quan trọng là xác định: chi tiền để làm gì.',
            sections: [
                { heading: 'Câu hỏi phải tự hỏi trước khi ghi', items: ['Khoản tiền đi ra này làm phát sinh chi phí mới hay chỉ là trả một khoản nợ cũ?', 'Tiền giảm là chắc chắn, nhưng bên đối ứng là chi phí hay công nợ?'] },
                { heading: 'Cặp định khoản thường gặp', items: ['Chi phí hoạt động như điện nước, văn phòng phẩm, lương: <code>Nợ 642 / Có 111 hoặc 112</code>.', 'Trả nợ nhà cung cấp: <code>Nợ 331 / Có 111 hoặc 112</code>.'] },
                { heading: 'Vì sao lại ghi như vậy', items: ['Khi chi tiền, tiền mặt hoặc ngân hàng giảm nên ghi <code>Có 111</code> hoặc <code>Có 112</code>.', 'Nếu chi để phục vụ hoạt động trong kỳ thì chi phí tăng, vì vậy ghi <code>Nợ 642</code>.', 'Nếu chỉ thanh toán khoản đã nợ nhà cung cấp từ trước, thì không tạo chi phí mới nữa. Lúc này cần giảm khoản phải trả nên ghi <code>Nợ 331</code>.'] },
                { heading: 'Sai lầm người mới hay gặp', items: ['Nhìn thấy chi tiền là ghi ngay vào chi phí. Sai trong trường hợp trả nợ cũ hoặc ứng trước.', 'Nhầm “chi tiền” với “phát sinh chi phí”. Kế toán quan tâm bản chất hơn là dòng tiền.'] }
            ]
        },
        'voucher-import': {
            title: 'Phiếu nhập kho',
            overview: 'Phiếu nhập kho ghi nhận việc mua hàng về. Người mới thường nhầm là “mua hàng = chi phí”, nhưng thực ra nếu hàng còn nằm trong kho thì đó vẫn là tài sản.',
            sections: [
                { heading: 'Cặp định khoản thường gặp', items: ['Nhập hàng chưa thanh toán: <code>Nợ 152 / Nợ 133 / Có 331</code>.', 'Nhập hàng thanh toán ngay bằng tiền: <code>Nợ 152 / Nợ 133 / Có 111 hoặc 112</code>.'] },
                { heading: 'Vì sao phải dùng cặp đó', items: ['<code>152</code> là nguyên vật liệu/hàng hóa trong kho. Mua về làm tài sản kho tăng nên ghi <code>Nợ 152</code>.', '<code>133</code> là thuế GTGT đầu vào được khấu trừ. Nếu hóa đơn mua hàng có VAT hợp lệ, doanh nghiệp có quyền khấu trừ phần thuế này, nên ghi <code>Nợ 133</code>.', 'Nếu chưa trả tiền cho nhà cung cấp thì nghĩa là doanh nghiệp đang mắc nợ họ, nên ghi <code>Có 331</code>.', 'Nếu trả tiền ngay thì không phát sinh nợ phải trả, thay vào đó tiền giảm nên ghi <code>Có 111</code> hoặc <code>Có 112</code>.'] },
                { heading: 'Giải thích kiểu đời thường', items: ['Bạn đổi tiền hoặc đổi “một lời hứa sẽ trả tiền sau” để lấy hàng hóa đưa vào kho.', 'Vì thế một bên tăng là hàng trong kho, bên còn lại hoặc là nợ nhà cung cấp, hoặc là tiền đã chi ra.'] },
                { heading: 'Sai lầm người mới hay gặp', items: ['Ghi mua hàng vào <code>642</code> ngay, làm chi phí tăng quá sớm.', 'Bỏ qua <code>133</code> nên cuối kỳ không khấu trừ được VAT đầu vào.'] }
            ]
        },
        'voucher-export': {
            title: 'Phiếu xuất kho',
            overview: 'Phiếu xuất kho là nghiệp vụ khó hơn vì một lần bán hàng thường sinh ra 2 bản chất khác nhau: vừa bán được hàng, vừa làm mất đi một phần hàng trong kho.',
            sections: [
                { heading: 'Hai cặp định khoản thường đi cùng nhau', items: ['Ghi nhận doanh thu: <code>Nợ 111, 112 hoặc 131 / Có 511 / Có 3331</code>.', 'Ghi nhận giá vốn: <code>Nợ 632 / Có 152</code>.'] },
                { heading: 'Vì sao phải tách làm 2 bút toán', items: ['Bút toán doanh thu trả lời câu hỏi: “Doanh nghiệp đã thu được quyền nhận bao nhiêu tiền từ khách?”', 'Bút toán giá vốn trả lời câu hỏi: “Để có doanh thu đó, doanh nghiệp đã xuất bao nhiêu giá trị hàng ra khỏi kho?”', 'Nếu chỉ ghi doanh thu mà không ghi giá vốn thì lợi nhuận sẽ bị cao giả tạo.'] },
                { heading: 'Vì sao dùng đúng các tài khoản đó', items: ['Khách trả tiền ngay thì tiền tăng, nên ghi <code>Nợ 111</code> hoặc <code>Nợ 112</code>. Nếu bán chịu, doanh nghiệp có quyền đòi tiền khách nên ghi <code>Nợ 131</code>.', 'Doanh thu bán hàng tăng nên ghi <code>Có 511</code>.', 'VAT đầu ra là khoản doanh nghiệp thu hộ Nhà nước, không phải doanh thu thật của doanh nghiệp, nên ghi riêng vào <code>Có 3331</code>.', 'Tồn kho nguyên vật liệu/hàng hóa giảm khi xuất bán nên ghi <code>Có 152</code>. Phần giá trị của kho đã tiêu hao để bán trở thành chi phí giá vốn nên ghi <code>Nợ 632</code>.'] },
                { heading: 'Cho người mới', items: ['Hãy nhớ: bán hàng không chỉ là “tiền vào”, mà còn là “hàng ra”.', 'Doanh thu cho biết bán được bao nhiêu, còn giá vốn cho biết đã hy sinh bao nhiêu hàng để tạo ra doanh thu đó.'] }
            ]
        },
        'fnb-orders': {
            title: 'Đơn hàng FnB (bán theo công thức)',
            overview: 'Dùng khi bán món ăn/đồ uống (MON_AN). Món không có tồn kho riêng, giá vốn được tính động bằng cách trừ kho nguyên liệu (NGUYEN_LIEU) theo định mức (recipe).',
            sections: [
                { heading: 'Ý tưởng cốt lõi (dễ hiểu)', items: ['Trong FnB, bạn không “xuất kho 1 ly cafe sữa” theo nghĩa kho có sẵn ly cafe sữa.', 'Thực tế bạn xuất kho <strong>nguyên liệu</strong> (hạt cafe, sữa đặc, đường...) để “tạo ra” món.', 'Vì vậy hệ thống lưu công thức <code>recipe</code> cho từng món và trừ kho nguyên liệu theo công thức đó.'] },
                { heading: 'Cấu trúc dữ liệu', items: ['<strong>NGUYÊN LIỆU</strong> có tồn kho theo chi nhánh và có <code>avgCost</code> (giá bình quân gia quyền).', '<strong>MÓN ĂN</strong> có <code>recipe: [{ materialId, quantityRequired }]</code> và không có tồn kho trực tiếp.'] },
                { heading: 'Hạch toán khi lưu đơn hàng', items: ['(1) <strong>Doanh thu theo từng món</strong>: mỗi món sinh 1 dòng <code>Nợ 000 / Có 511</code> theo số lượng x đơn giá (chưa VAT).', '(2) <strong>Giá vốn theo từng nguyên liệu</strong>: hệ thống duyệt recipe của món và sinh các dòng <code>Nợ 632 / Có 152</code> theo lượng tiêu hao x giá bình quân nguyên liệu tại chi nhánh.', '(3) <strong>VAT và Thu tiền</strong>: gom cuối đơn: <code>Nợ 000 / Có 3331</code> (VAT) và <code>Nợ 111/112/131 / Có 000</code> (tổng thanh toán).'] },
                { heading: 'Vì sao cần “chặn thiếu kho”', items: ['Nếu thiếu bất kỳ nguyên liệu nào, thực tế bạn không thể làm món đó.', 'Nếu vẫn cho bán, báo cáo kho sẽ âm và giá vốn/lợi nhuận sẽ sai.', 'Vì vậy hệ thống sẽ kiểm tra tồn kho nguyên liệu trước khi ghi nhận đơn hàng.'] },
                { heading: 'Gắn chi nhánh', items: ['Mỗi đơn hàng có chi nhánh. Kho nguyên liệu, giá vốn và bút toán phát sinh đều gắn <code>branchId</code> để xem lãi/lỗ và kho theo từng chi nhánh.'] }
            ]
        },
        'receivables-payables': {
            title: 'Báo cáo công nợ',
            overview: 'Trang này không trực tiếp sinh bút toán mới, nhưng giúp bạn hiểu doanh nghiệp còn phải thu của ai và còn phải trả cho ai.',
            sections: [
                { heading: 'Bản chất kế toán', items: ['<code>131</code> là quyền đòi tiền khách hàng.', '<code>331</code> là nghĩa vụ phải trả tiền cho nhà cung cấp.'] },
                { heading: 'Vì sao công nợ quan trọng', items: ['Doanh thu cao chưa chắc đã thu được tiền ngay nếu phần lớn là bán chịu.', 'Chi phí mua hàng cũng chưa chắc đã trả tiền ngay nếu đang nợ nhà cung cấp.'] },
                { heading: 'Liên hệ với cặp định khoản', items: ['Bán chịu làm tăng <code>131</code>, nên ở phiếu xuất kho thường có <code>Nợ 131</code>.', 'Khách trả nợ làm giảm <code>131</code>, nên ở phiếu thu thường có <code>Có 131</code>.', 'Mua hàng chưa trả làm tăng <code>331</code>, nên ở phiếu nhập kho thường có <code>Có 331</code>.', 'Trả nợ nhà cung cấp làm giảm <code>331</code>, nên ở phiếu chi thường có <code>Nợ 331</code>.'] }
            ]
        },
        'cash-flow': {
            title: 'Báo cáo dòng tiền',
            overview: 'Trang này giải thích tiền thực sự đi vào hay đi ra doanh nghiệp. Đây là góc nhìn “tiền mặt” chứ không phải góc nhìn “lãi lỗ”.',
            sections: [
                { heading: 'Vì sao cần xem dòng tiền riêng', items: ['Một doanh nghiệp có thể có lãi trên sổ sách nhưng vẫn thiếu tiền nếu bán chịu quá nhiều.', 'Ngược lại, một khoản thu tiền có thể không phải doanh thu mới mà chỉ là thu nợ cũ.'] },
                { heading: 'Liên hệ với định khoản', items: ['Chỉ giao dịch nào chạm vào <code>111</code> hoặc <code>112</code> mới xuất hiện ở báo cáo này.', 'Nếu bút toán có <code>Nợ 111/112</code> thì đó thường là tiền vào.', 'Nếu bút toán có <code>Có 111/112</code> thì đó thường là tiền ra.'] },
                { heading: 'Cho người mới', items: ['Lợi nhuận trả lời câu hỏi “bán có lời không”.', 'Dòng tiền trả lời câu hỏi “có đủ tiền để sống và trả nợ không”. Hai câu hỏi này khác nhau.'] }
            ]
        },
        'journal': {
            title: 'Sổ nhật ký chung',
            overview: 'Đây là nơi nhìn thấy toàn bộ bút toán theo thứ tự thời gian, giống như “camera lịch sử” của hệ thống kế toán.',
            sections: [
                { heading: 'Trang này giúp gì cho người mới', items: ['Bạn nhìn được một giao dịch đã vào tài khoản Nợ nào, Có tài khoản nào và số tiền bao nhiêu.', 'Nếu chưa hiểu tại sao hệ thống sinh ra một cặp định khoản, đây là nơi kiểm tra nhanh nhất.'] },
                { heading: 'Cách đọc 1 dòng nhật ký', items: ['Cột <strong>Nợ</strong> là nơi nhận giá trị tăng hoặc nơi ghi nhận chi phí/tài sản theo bản chất.', 'Cột <strong>Có</strong> là nơi nguồn giá trị đi ra hoặc nơi ghi nhận doanh thu/nghĩa vụ phải trả theo bản chất.', 'Đừng cố nhớ máy móc. Hãy tự hỏi: “giá trị đi vào đâu và đi ra từ đâu?”'] },
                { heading: 'Lưu ý', items: ['Sổ nhật ký không phải nơi sửa nghiệp vụ gốc.', 'Nếu thấy bút toán sai, cần quay lại page phát sinh chứng từ để sửa bản chất giao dịch.'] }
            ]
        },
        'ledger': {
            title: 'Sổ chi tiết tài khoản',
            overview: 'Trang này đi sâu vào một tài khoản cụ thể để trả lời câu hỏi: số dư tài khoản này tăng giảm vì những giao dịch nào.',
            sections: [
                { heading: 'Vì sao người mới nên xem sổ chi tiết', items: ['Khi chưa quen, bạn rất dễ thấy “số dư 131 = 20 triệu” nhưng không biết từ đâu ra.', 'Sổ chi tiết cho phép lần ngược từng giao dịch làm tăng hoặc giảm tài khoản đó.'] },
                { heading: 'Cách hiểu số dư chạy', items: ['Nếu tài khoản được ghi Nợ thì số dư thường tăng theo chiều Nợ.', 'Nếu tài khoản bị ghi Có thì số dư sẽ giảm hoặc chuyển theo bản chất của tài khoản đó.'] },
                { heading: 'Liên hệ với cặp định khoản', items: ['Ví dụ xem tài khoản <code>131</code>, bạn sẽ thấy bán chịu làm tăng 131 còn thu nợ làm giảm 131.', 'Ví dụ xem tài khoản <code>111</code>, bạn sẽ thấy phiếu thu làm tăng tiền còn phiếu chi làm giảm tiền.'] }
            ]
        },
        'closing': {
            title: 'Kết chuyển cuối kỳ',
            overview: 'Đây là bước “chốt sổ” để gom doanh thu, chi phí, VAT và thuế TNDN về đúng nơi, từ đó xác định doanh nghiệp lãi hay lỗ.',
            sections: [
                { heading: 'Ý tưởng đơn giản cho newbie', items: ['Suốt tháng, doanh thu nằm ở nhóm tài khoản 5, chi phí nằm ở nhóm tài khoản 6, 8.', 'Cuối kỳ phải gom chúng về một nơi trung tâm là <code>911</code> để biết kết quả kinh doanh.'] },
                { heading: 'Vì sao lại dùng <code>911</code>', items: ['<code>911</code> không phải tiền, không phải hàng hóa, mà là tài khoản dùng riêng để xác định kết quả kinh doanh.', 'Có thể hiểu <code>911</code> là “bàn cân” đặt doanh thu một bên và chi phí một bên để xem lãi hay lỗ.'] },
                { heading: 'Cặp định khoản chính và lý do', items: ['Kết chuyển doanh thu: <code>Nợ 511, 711 / Có 911</code> vì doanh thu đang có số dư Có, muốn đưa doanh thu về 0 thì phải ghi ngược lại ở bên Nợ.', 'Kết chuyển chi phí: <code>Nợ 911 / Có 632, 642, 811, 821</code> vì chi phí thường đang nằm bên Nợ, muốn đưa chúng về 0 thì phải ghi ngược sang bên Có.', 'Khấu trừ VAT: <code>Nợ 3331 / Có 133</code> vì dùng VAT đầu vào được khấu trừ để bù trừ VAT đầu ra phải nộp.', 'Tính thuế TNDN: <code>Nợ 821 / Có 3334</code> vì thuế TNDN là chi phí của kỳ nhưng đồng thời tạo ra nghĩa vụ phải nộp cho Nhà nước.', 'Kết chuyển thuế TNDN: <code>Nợ 911 / Có 821</code> để đưa chi phí thuế vào kết quả kinh doanh.', 'Chốt lãi: <code>Nợ 911 / Có 421</code>, chốt lỗ: <code>Nợ 421 / Có 911</code> vì cuối cùng lãi lỗ phải chuyển sang lợi nhuận chưa phân phối.'] },
                { heading: 'Cho người mới', items: ['Nếu chưa kết chuyển, doanh thu và chi phí vẫn nằm rải rác ở nhiều tài khoản khác nhau.', 'Kết chuyển chính là bước “dọn bàn” để biết tháng này thực chất lời bao nhiêu hay lỗ bao nhiêu.'] }
            ]
        },
        'closing-config': {
            title: 'Cấu hình kết chuyển',
            overview: 'Page này nói cho hệ thống biết tài khoản doanh thu và chi phí nào phải tham gia vào quy trình kết chuyển cuối kỳ.',
            sections: [
                { heading: 'Vì sao cần cấu hình thay vì hardcode', items: ['Doanh nghiệp có thể tự tạo thêm tài khoản như <code>6421</code>, <code>6422</code>, <code>5111</code>, <code>8111</code>.', 'Nếu hệ thống chỉ biết vài tài khoản cố định thì cuối kỳ sẽ bỏ sót những tài khoản mới phát sinh.'] },
                { heading: 'Cách hiểu quy tắc', items: ['Nếu là tài khoản doanh thu thì hệ thống sẽ dùng logic kiểu <code>Nợ tài khoản doanh thu / Có 911</code>.', 'Nếu là tài khoản chi phí thì hệ thống sẽ dùng logic kiểu <code>Nợ 911 / Có tài khoản chi phí</code>.'] },
                { heading: 'Vì sao phải phân loại đúng', items: ['Nếu lỡ đánh một tài khoản chi phí thành doanh thu, hệ thống sẽ kết chuyển ngược chiều và làm sai kết quả lãi lỗ.', 'Vì vậy page này không trực tiếp lập bút toán, nhưng quyết định bút toán cuối kỳ có đúng bản chất hay không.'] }
            ]
        },
        'opening-balance': {
            title: 'Số dư đầu kỳ',
            overview: 'Số dư đầu kỳ là điểm xuất phát của toàn bộ hệ thống. Nếu nhập sai ở đây, mọi báo cáo sau đó đều có thể sai dù các chứng từ trong kỳ đúng.',
            sections: [
                { heading: 'Bản chất của số dư đầu kỳ', items: ['Đây là tài sản, nợ phải trả, vốn và hàng tồn đang có trước khi bắt đầu ghi nhận giao dịch mới.', 'Có thể hiểu nó là “ảnh chụp đầu tháng” trước khi tháng mới bắt đầu chạy.'] },
                { heading: 'Vì sao phải cân', items: ['Trong kế toán, tài sản luôn phải bằng nguồn hình thành tài sản.', 'Nếu nhập đầu kỳ mà lệch, tức là bạn đang nói doanh nghiệp có tài sản nhưng không rõ được hình thành từ nợ hay vốn, hoặc ngược lại.'] },
                { heading: 'Cho người mới', items: ['Nếu công ty có tiền 50 triệu thì phải có một nguồn tương ứng, ví dụ vốn chủ sở hữu hoặc khoản phải trả.', 'Không thể chỉ nhập tiền mà quên phần vốn tạo ra số tiền đó, vì như vậy hệ thống sẽ mất cân bằng.'] }
            ]
        },
        'lock-period': {
            title: 'Khóa sổ kỳ kế toán',
            overview: 'Khóa sổ là bước kiểm soát để ngăn việc sửa chứng từ của kỳ đã chốt, giúp số liệu báo cáo không bị thay đổi ngoài ý muốn.',
            sections: [
                { heading: 'Vì sao doanh nghiệp phải khóa sổ', items: ['Nếu tháng trước đã nộp báo cáo nhưng ai đó vẫn sửa chứng từ cũ, số liệu hiện tại và số đã báo cáo sẽ lệch nhau.', 'Khóa sổ giúp đảm bảo “tháng đã chốt thì không bị xê dịch nữa”.'] },
                { heading: 'Liên hệ với nghiệp vụ kế toán', items: ['Khóa sổ không tạo ra cặp định khoản mới.', 'Nhưng nó là lớp kiểm soát cực quan trọng sau khi đã nhập liệu, đối chiếu và kết chuyển.'] },
                { heading: 'Cho người mới', items: ['Hãy nghĩ nó như việc niêm phong sổ sách tháng cũ.', 'Nếu buộc phải mở lại, bạn cần biết rằng mọi báo cáo liên quan cũng có thể phải cập nhật lại.'] }
            ]
        },
        'balance': {
            title: 'Bảng cân đối kế toán',
            overview: 'Trang này giúp bạn trả lời câu hỏi lớn nhất của kế toán: doanh nghiệp đang có gì và các tài sản đó hình thành từ đâu.',
            sections: [
                { heading: 'Cách hiểu cực đơn giản', items: ['Vế trái là tài sản: tiền, hàng, phải thu, tài sản cố định...', 'Vế phải là nguồn hình thành: nợ phải trả và vốn chủ sở hữu.'] },
                { heading: 'Vì sao phải luôn cân', items: ['Tài sản không tự nhiên xuất hiện. Nếu có thêm tài sản thì phải do chủ bỏ vốn vào, đi vay, bán hàng tạo ra quyền đòi tiền, hoặc chuyển đổi từ tài sản khác.', 'Vì vậy tổng tài sản luôn phải bằng tổng nguồn hình thành tài sản.'] },
                { heading: 'Liên hệ với định khoản', items: ['Mỗi bút toán đúng sẽ luôn làm hệ thống vẫn cân sau giao dịch.', 'Nếu bảng cân đối lệch, thường là dấu hiệu định khoản sai, thiếu một vế, hoặc nhập sai số dư đầu kỳ.'] }
            ]
        }
    };

    function getCurrentModuleName() {
        return document.body?.dataset?.pageModule || 'dashboard';
    }

    function getBusinessDoc(moduleName) {
        return businessDocs[moduleName] || {
            title: 'Tài liệu nghiệp vụ',
            overview: 'Trang này hỗ trợ người dùng thao tác nghiệp vụ theo đúng luồng kế toán.',
            sections: [
                { heading: 'Mục đích', items: ['Hỗ trợ hiểu nhanh ý nghĩa của màn hình hiện tại.', 'Giúp người mới biết khi nào nên dùng trang này.'] }
            ]
        };
    }

    function ensureBusinessDocModal() {
        let modal = document.getElementById('business-doc-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'business-doc-modal';
        modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/70 p-4 doc-modal-backdrop';
        modal.innerHTML = `
            <div class="w-full max-w-3xl glassmorphism rounded-2xl border border-slate-700 shadow-2xl">
                <div class="flex items-start justify-between gap-4 border-b border-slate-700 px-6 py-5">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Tài liệu nghiệp vụ</p>
                        <h3 id="business-doc-title" class="mt-2 text-2xl font-bold text-slate-100"></h3>
                        <p id="business-doc-overview" class="mt-2 text-sm text-slate-400"></p>
                    </div>
                    <button type="button" id="business-doc-close" class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300 transition hover:bg-slate-700 hover:text-white">Đóng</button>
                </div>
                <div id="business-doc-body" class="max-h-[70vh] space-y-4 overflow-auto px-6 py-5"></div>
            </div>
        `;

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeBusinessDoc();
            }
        });

        document.body.appendChild(modal);
        document.getElementById('business-doc-close')?.addEventListener('click', closeBusinessDoc);
        return modal;
    }

    function openBusinessDoc(moduleName = getCurrentModuleName()) {
        const doc = getBusinessDoc(moduleName);
        const modal = ensureBusinessDocModal();
        const titleEl = document.getElementById('business-doc-title');
        const overviewEl = document.getElementById('business-doc-overview');
        const bodyEl = document.getElementById('business-doc-body');

        if (titleEl) titleEl.textContent = doc.title;
        if (overviewEl) overviewEl.textContent = doc.overview;
        if (bodyEl) {
            bodyEl.innerHTML = doc.sections.map(section => `
                <section class="doc-section">
                    <h4>${section.heading}</h4>
                    <ul>
                        ${section.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </section>
            `).join('');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeBusinessDoc() {
        const modal = document.getElementById('business-doc-modal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    function initBusinessDocUI() {
        const moduleName = getCurrentModuleName();
        const moduleContainer = document.getElementById(`module-${moduleName}`);
        if (!moduleContainer || moduleContainer.querySelector('[data-role="business-doc-trigger"]')) return;

        const headerBlock = moduleContainer.querySelector('.mb-6');
        if (!headerBlock) return;

        const actionRow = document.createElement('div');
        actionRow.className = 'mb-6 flex justify-end';
        actionRow.innerHTML = `
            <button type="button" data-role="business-doc-trigger" class="doc-trigger-btn rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20 hover:text-cyan-200">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Tài liệu nghiệp vụ</span>
            </button>
        `;

        headerBlock.insertAdjacentElement('afterend', actionRow);
        actionRow.querySelector('[data-role="business-doc-trigger"]')?.addEventListener('click', () => openBusinessDoc(moduleName));
    }

    function ensureBranchSidebarNav() {
        if (document.getElementById('nav-branches')) return;

        const accountsButton = document.getElementById('nav-accounts');
        const nav = accountsButton?.closest('nav');
        if (!accountsButton || !nav) return;

        const button = document.createElement('button');
        button.id = 'nav-branches';
        button.className = 'nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3';
        button.setAttribute('onclick', "showModule('branches')");
        button.innerHTML = `
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5V4H2v16h5m10 0v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4m10 0H7m5-12a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span>Chi nhánh</span>
        `;

        accountsButton.insertAdjacentElement('afterend', button);
    }

    function ensureInterBranchTransferSidebarNav() {
        if (document.getElementById('nav-inter-branch-transfer')) return;

        const anchor = document.getElementById('nav-voucher-export') || document.getElementById('nav-voucher-import') || document.getElementById('nav-voucher-pay') || document.getElementById('nav-voucher-receive');
        const nav = anchor?.closest('nav');
        if (!nav) return;

        const button = document.createElement('button');
        button.id = 'nav-inter-branch-transfer';
        button.className = 'nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3';
        button.setAttribute('onclick', "showModule('inter-branch-transfer')");
        button.innerHTML = `
            <svg class="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            <span>Điều chuyển nội bộ</span>
        `;

        if (anchor) {
            anchor.insertAdjacentElement('afterend', button);
        } else {
            nav.appendChild(button);
        }
    }

    function ensureInvoicesSidebarNav() {
        if (document.getElementById('nav-invoices')) return;

        const anchor = document.getElementById('nav-receivables-payables') || document.getElementById('nav-cash-flow');
        const nav = anchor?.closest('nav');
        if (!nav) return;

        const button = document.createElement('button');
        button.id = 'nav-invoices';
        button.className = 'nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3';
        button.setAttribute('onclick', "showModule('invoices')");
        button.innerHTML = `
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Hóa đơn bán hàng</span>
        `;

        if (anchor) {
            anchor.insertAdjacentElement('afterend', button);
        } else {
            nav.appendChild(button);
        }
    }

    function ensureStandardSidebar() {
        const sidebar = document.querySelector('aside');
        if (!sidebar || sidebar.dataset.standardized === '1') return;

        sidebar.dataset.standardized = '1';
        sidebar.className = 'w-64 glassmorphism border-r border-slate-700 flex flex-col';
        sidebar.innerHTML = `
            <div class="p-6 border-b border-slate-700">
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Kế Toán Dễ Dàng
                </h1>
                <p class="text-xs text-slate-400 mt-1">Dành cho người mới</p>
            </div>
            <nav class="flex-1 p-4 space-y-2 overflow-auto">
                <button onclick="showModule('dashboard')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-dashboard">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 011 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>Tổng quan</span>
                </button>
                <button onclick="showModule('accounts')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-accounts">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Hệ thống tài khoản</span>
                </button>
                <button onclick="showModule('branches')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-branches">
                    <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5V4H2v16h5m10 0v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4m10 0H7m5-12a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                    <span>Chi nhánh</span>
                </button>
                <button onclick="showModule('inventory')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-inventory">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <span>Quản lý kho</span>
                </button>
                <button onclick="showModule('fixed-assets')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-fixed-assets">
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m-3 0h6m-6 0h6a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2"/>
                    </svg>
                    <span>Tài sản cố định</span>
                </button>

                <div class="pt-4 pb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lập phiếu</div>
                <button onclick="showModule('voucher-receive')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-voucher-receive">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Phiếu Thu</span>
                </button>
                <button onclick="showModule('voucher-pay')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-voucher-pay">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                    <span>Phiếu Chi</span>
                </button>
                <button onclick="showModule('voucher-import')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-voucher-import">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <span>Phiếu Nhập Kho</span>
                </button>
                <button onclick="showModule('voucher-export')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-voucher-export">
                    <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <span>Phiếu Xuất Kho</span>
                </button>
                <button onclick="showModule('fnb-orders')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-fnb-orders">
                    <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-1 9H4L3 3zm3 18a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2zM5 12l-1 7h16l-1-7"/>
                    </svg>
                    <span>Đơn hàng FnB</span>
                </button>
                <button onclick="showModule('inter-branch-transfer')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-inter-branch-transfer">
                    <svg class="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                    <span>Điều chuyển nội bộ</span>
                </button>

                <div class="pt-4 pb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Báo cáo</div>
                <button onclick="showModule('invoices')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-invoices">
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Hóa đơn bán hàng</span>
                </button>
                <button onclick="showModule('vouchers')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-vouchers">
                    <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 012-2z"/>
                    </svg>
                    <span>Danh sách phiếu</span>
                </button>
                <button onclick="showModule('receivables-payables')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-receivables-payables">
                    <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span>Công nợ</span>
                </button>
                <button onclick="showModule('cash-flow')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-cash-flow">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span>Dòng tiền</span>
                </button>
                <button onclick="showModule('journal')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-journal">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                    <span>Sổ Nhật Ký</span>
                </button>
                <button onclick="showModule('ledger')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-ledger">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"/>
                    </svg>
                    <span>Sổ Chi Tiết</span>
                </button>
                <button onclick="showModule('closing')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-closing">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 012-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span>Kết chuyển cuối kỳ</span>
                </button>
                <button onclick="showModule('closing-config')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-closing-config">
                    <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317a1 1 0 011.35-.936l1.874.75a1 1 0 00.742 0l1.874-.75a1 1 0 011.35.936l.137 2.014a1 1 0 00.29.626l1.425 1.425a1 1 0 010 1.414l-1.425 1.425a1 1 0 00-.29.626l-.137 2.014a1 1 0 01-1.35.936l-1.874-.75a1 1 0 00-.742 0l-1.874.75a1 1 0 01-1.35-.936l-.137-2.014a1 1 0 00-.29-.626L3.54 9.61a1 1 0 010-1.414l1.425-1.425a1 1 0 00.29-.626l.137-2.014z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    </svg>
                    <span>Cấu hình kết chuyển</span>
                </button>
                <button onclick="showModule('opening-balance')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-opening-balance">
                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0v-6m0 0l6 3m-6-3l-6 3m6-3V4m0 14a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span>Cài đặt số dư đầu kỳ</span>
                </button>
                <button onclick="showModule('lock-period')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-lock-period">
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span>Khóa sổ</span>
                </button>
                <button onclick="showModule('balance')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-3" id="nav-balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                    </svg>
                    <span>Bảng Cân Đối</span>
                </button>
            </nav>
        `;
    }

    function ensureBranchField(formId, selectId, accentClass = 'focus:border-cyan-500') {
        const form = document.getElementById(formId);
        if (!form || document.getElementById(selectId)) return;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <label class="block text-sm mb-2">Chi nhánh</label>
            <select id="${selectId}" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none ${accentClass}"></select>
        `;

        const firstGrid = form.querySelector('.grid');
        if (firstGrid) {
            firstGrid.insertAdjacentElement('afterend', wrapper);
        } else {
            form.insertAdjacentElement('afterbegin', wrapper);
        }
    }

    function ensureFilterRow(moduleId, filterId, labelText = 'Phạm vi số liệu', onchangeHandler = '') {
        const moduleContainer = document.getElementById(moduleId);
        if (!moduleContainer || document.getElementById(filterId)) return;

        const headerBlock = moduleContainer.querySelector('.mb-6, .flex.items-center.justify-between.mb-6');
        if (!headerBlock) return;

        const row = document.createElement('div');
        row.className = 'mb-6 flex flex-wrap items-end gap-3';
        row.innerHTML = `
            <div>
                <label class="block text-sm mb-2">${labelText}</label>
                <select id="${filterId}" class="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none min-w-[250px]" ${onchangeHandler ? `onchange="${onchangeHandler}"` : ''}></select>
            </div>
        `;
        headerBlock.insertAdjacentElement('afterend', row);
    }

    function ensureJournalBranchFilter() {
        const controls = document.querySelector('#module-journal .flex.gap-3');
        if (!controls || document.getElementById('journal-branch-filter')) return;

        const select = document.createElement('select');
        select.id = 'journal-branch-filter';
        select.className = 'bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none';
        select.setAttribute('onchange', 'renderJournal()');
        controls.insertAdjacentElement('afterbegin', select);
    }

    function ensureLedgerBranchFilter() {
        const accountSelect = document.getElementById('ledger-account');
        if (!accountSelect || document.getElementById('ledger-branch-filter')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-wrap gap-3';
        accountSelect.insertAdjacentElement('beforebegin', wrapper);
        wrapper.appendChild(accountSelect);

        const select = document.createElement('select');
        select.id = 'ledger-branch-filter';
        select.className = 'bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none min-w-[230px]';
        select.setAttribute('onchange', 'renderLedger()');
        wrapper.insertAdjacentElement('afterbegin', select);
    }

    function initBranchUI() {
        ensureStandardSidebar();
        ensureBranchSidebarNav();
        ensureInterBranchTransferSidebarNav();
        ensureInvoicesSidebarNav();
        ensureBranchField('form-receive', 'recv-branch', 'focus:border-green-500');
        ensureBranchField('form-pay', 'pay-branch', 'focus:border-red-500');
        ensureBranchField('form-import', 'import-branch', 'focus:border-blue-500');
        ensureBranchField('form-export', 'export-branch', 'focus:border-orange-500');
        ensureBranchField('form-add-asset', 'asset-branch', 'focus:border-yellow-500');
        ensureJournalBranchFilter();
        ensureLedgerBranchFilter();
        ensureFilterRow('module-dashboard', 'dashboard-branch-filter', 'Phạm vi số liệu', 'renderDashboard()');
        ensureFilterRow('module-accounts', 'accounts-branch-filter', 'Xem số dư theo chi nhánh', 'renderAccountTree()');
        ensureFilterRow('module-inventory', 'inventory-branch-filter', 'Xem tồn kho theo chi nhánh', 'renderInventory()');
        ensureFilterRow('module-invoices', 'invoices-branch-filter', 'Phạm vi hóa đơn', 'renderInvoices()');
        ensureFilterRow('module-vouchers', 'vouchers-branch-filter', 'Phạm vi phiếu', 'renderVouchers()');
        ensureFilterRow('module-receivables-payables', 'receivables-branch-filter', 'Phạm vi công nợ', 'renderReceivablesPayables()');
        ensureFilterRow('module-cash-flow', 'cashflow-branch-filter', 'Phạm vi dòng tiền', 'renderCashFlow()');
        ensureFilterRow('module-balance', 'balance-branch-filter', 'Phạm vi cân đối', 'renderBalanceSheet()');
        ensureFilterRow('module-closing', 'closing-branch-filter', 'Phạm vi kết chuyển', '');
        ensureFilterRow('module-closing-config', 'closing-config-branch-filter', 'Phạm vi cấu hình kết chuyển', 'renderClosingRules()');
        ensureFilterRow('module-lock-period', 'lock-period-branch-filter', 'Phạm vi khóa sổ', 'renderLockPeriodTable()');
    }

    function showModule(moduleName) {
        const currentModule = getCurrentModuleName();
        if (modulePageMap[moduleName] && moduleName !== currentModule) {
            window.location.href = modulePageMap[moduleName];
            return;
        }

        document.querySelectorAll('.module').forEach(m => m.classList.add('hidden'));
        const target = document.getElementById(`module-${moduleName}`);
        if (target) target.classList.remove('hidden');
        
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.getElementById(`nav-${moduleName}`);
        if (navItem) navItem.classList.add('active');

        // Render new modules if needed
        if (moduleName === 'opening-balance') {
            renderOpeningBalance();
        }
        if (moduleName === 'lock-period') {
            populateBranchSelects();
            renderLockPeriodTable();
        }
        if (moduleName === 'closing-config') {
            populateBranchSelects();
            populateClosingSourceSelect();
            renderClosingRules();
        }
        if (moduleName === 'invoices') {
            populateBranchSelects();
            renderInvoices();
        }
        if (moduleName === 'vouchers') {
            populateBranchSelects();
            renderVouchers();
        }
        if (moduleName === 'voucher-import') {
            const importProducts = document.getElementById('import-products');
            if (importProducts && importProducts.children.length === 0) {
                addImportProduct();
            }
        }
        if (moduleName === 'voucher-export') {
            const exportProducts = document.getElementById('export-products');
            if (exportProducts && exportProducts.children.length === 0) {
                addExportProduct();
            }
        }
        if (moduleName === 'fnb-orders') {
            const dateEl = document.getElementById('fnb-date');
            if (dateEl) dateEl.value = getToday();
            populateBranchSelects();
            populatePartnerSelects();
            populateAccountSelects();
            const items = document.getElementById('fnb-items');
            if (items && items.children.length === 0) {
                addFnbOrderItem();
            }
            calculateFnbOrderTotals();
        }
        if (moduleName === 'voucher-receive') {
            const recvDate = document.getElementById('recv-date');
            if (recvDate) recvDate.value = getToday();
            updateRecvExplanation();
        }
        if (moduleName === 'voucher-pay') {
            const payDate = document.getElementById('pay-date');
            if (payDate) payDate.value = getToday();
            updatePayExplanation();
        }
        if (moduleName === 'receivables-payables') {
            renderReceivablesPayables();
        }
        if (moduleName === 'cash-flow') {
            renderCashFlow();
        }
        if (moduleName === 'inter-branch-transfer') {
            const ibtDate = document.getElementById('ibt-date');
            if (ibtDate) ibtDate.value = getToday();
            populateBranchSelects();
            updateInterBranchTransferUI();
        }
        if (moduleName === 'fixed-assets') {
            renderFixedAssets();
        }
        if (moduleName === 'branches') {
            renderBranches();
        }
    }

    function renderAll() {
        syncGlobalProductsFromBranchStocks();
        updateInventoryAccount();
        updateFixedAssetAccount();
        renderAccountTree();
        renderJournal();
        renderBalanceSheet();
        renderDashboard();
        renderInventory();
        renderFixedAssets();
        renderReceivablesPayables();
        renderCashFlow();
        renderInvoices();
        renderVouchers();
        populateAccountSelects();
        populateBranchSelects();
        populateClosingSourceSelect();
        populatePartnerSelects();
        populateLoaiThuSelect();
        populateLoaiChiSelect();
        renderClosingRules();
        renderLedger();
        renderBranches();
        saveState();
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadState();
        initBranchUI();
        initBusinessDocUI();

        const addAccountForm = document.getElementById('form-add-account');
        if (addAccountForm) {
            addAccountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addAccount();
            });
        }

        const addPartnerForm = document.getElementById('form-add-partner');
        if (addPartnerForm) {
            addPartnerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addPartner();
                hideAddPartnerModal();
            });
        }

        const addAssetForm = document.getElementById('form-add-asset');
        if (addAssetForm) {
            addAssetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addFixedAsset();
            });
        }

        document.getElementById('form-add-branch')?.addEventListener('submit', (e) => {
            e.preventDefault();
            addBranch();
        });

        document.getElementById('form-receive')?.addEventListener('submit', saveReceiveVoucher);
        document.getElementById('form-pay')?.addEventListener('submit', savePayVoucher);
        document.getElementById('form-import')?.addEventListener('submit', saveImportVoucher);
        document.getElementById('form-export')?.addEventListener('submit', saveExportVoucher);
        document.getElementById('form-fnb-order')?.addEventListener('submit', saveFnbOrder);
        document.getElementById('form-inter-branch-transfer')?.addEventListener('submit', saveInterBranchTransferVoucher);

        // Auto fill amount and update preview event listeners - Phiếu Thu
        document.getElementById('recv-loai-thu')?.addEventListener('change', updateRecvExplanation);
        document.getElementById('recv-partner')?.addEventListener('change', updateRecvExplanation);
        document.getElementById('recv-phuong-thuc-tt')?.addEventListener('change', updateRecvExplanation);
        document.getElementById('recv-amount')?.addEventListener('input', updateRecvPreview);

        // Auto fill amount and update preview event listeners - Phiếu Chi
        document.getElementById('pay-loai-chi')?.addEventListener('change', updatePayExplanation);
        document.getElementById('pay-partner')?.addEventListener('change', updatePayExplanation);
        document.getElementById('pay-phuong-thuc-tt')?.addEventListener('change', updatePayExplanation);
        document.getElementById('pay-amount')?.addEventListener('input', updatePayPreview);
        
        // Update custom accounts when payment method changes - Phiếu Nhập
        document.getElementById('import-payment')?.addEventListener('change', () => {
            populateAccountSelects();
            updateImportPreview();
        });
        
        // Update custom accounts when payment method changes - Phiếu Xuất
        document.getElementById('export-payment')?.addEventListener('change', () => {
            populateAccountSelects();
            updateExportPreview();
        });

        document.getElementById('fnb-branch')?.addEventListener('change', () => {
            populateAccountSelects();
            calculateFnbOrderTotals();
        });
        document.getElementById('fnb-vat')?.addEventListener('input', calculateFnbOrderTotals);

        document.getElementById('ibt-type')?.addEventListener('change', updateInterBranchTransferUI);
        document.getElementById('ibt-from-branch')?.addEventListener('change', () => {
            populateInterBranchTransferProductSelects();
            calculateInterBranchTransferGoodsTotals();
        });

        document.getElementById('recv-branch')?.addEventListener('change', () => {
            populateAccountSelects();
            updateRecvExplanation();
            updateRecvPreview();
        });
        document.getElementById('pay-branch')?.addEventListener('change', () => {
            populateAccountSelects();
            updatePayExplanation();
            updatePayPreview();
        });
        document.getElementById('import-branch')?.addEventListener('change', () => {
            populateAccountSelects();
            calculateImportTotals();
            updateImportPreview();
        });
        document.getElementById('export-branch')?.addEventListener('change', () => {
            populateAccountSelects();
            calculateExportTotals();
            updateExportPreview();
        });
        document.getElementById('ledger-branch-filter')?.addEventListener('change', () => {
            populateAccountSelects();
            renderLedger();
        });
        document.getElementById('accounts-branch-filter')?.addEventListener('change', () => {
            populateAccountSelects();
            onParentSelect();
            renderAccountTree();
        });
        
        renderAll();
        showModule(getCurrentModuleName());
    });

    window.addEventListener('beforeunload', saveState);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeBusinessDoc();
        }
    });
