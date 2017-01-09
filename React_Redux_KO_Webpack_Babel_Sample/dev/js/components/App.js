import React from 'react';
import UserList from '../containers/user-list';
import UserDetails from '../containers/user-detail';

require('../../styles/player_style.css');
require('../../styles/video_player.css');
require('../../styles/buttons.css');
require('../../styles/identity_badge.css');

require('../../js/player_related/utility.js');
require('../../js/player_related/commentsModel.js');
require('../../js/player_related/appViewModel.js');

const App = () => (
    <div>
        <h2>Comment As A Monster</h2>
        <UserList />
        <div id="monster_info">
        <h2>User Details</h2>
        <UserDetails />
        </div>
    </div>
);

export default App;